import { describe, it, expect, vi, afterEach } from 'vitest'

const STORE_KEY = 'hufs-clock-settings'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// 사용자가 이미 설정을 마친 상태(디스크에 저장돼 있는 실제 데이터)를 흉내낸다.
// 이 값이 어떤 상황에서도 기본값으로 덮어써지지 않아야 한다.
function makeSavedState() {
  return JSON.stringify({
    state: {
      isDarkMode: true,
      selectedCampus: 'GLOBAL',
      userName: '테스트유저',
      enterYear: '20',
      inCartCourse: [],
      lastSeenNoticeId: 3,
      customBookmarkCount: 6,
      isBookmarkPinned: true,
      userLink: [
        { id: 0, hotLinkName: '🏛️ 홈페이지', hotLink: 'https://www.hufs.ac.kr', custom: false },
        { id: 4, hotLinkName: '내가 추가한 북마크', hotLink: 'https://example.com', custom: true },
      ],
    },
    version: 1,
  })
}

// 인메모리 디스크를 가진 가짜 chrome.storage.local.
// jsdom에는 chrome이 없어서, 주입하지 않으면 localStorage 분기만 타고
// 실제 버그가 있는 chrome.storage 경로가 전혀 검증되지 않는다.
function createFakeChrome({ initial = {}, getBehavior = 'ok', getDelayMs = 0 } = {}) {
  const disk = { ...initial }
  const listeners = []

  const local = {
    get: vi.fn(async (name) => {
      if (getDelayMs) await sleep(getDelayMs)
      if (getBehavior === 'reject') throw new Error('storage read failed')
      return name in disk ? { [name]: disk[name] } : {}
    }),
    set: vi.fn(async (obj) => {
      Object.assign(disk, obj)
      const changes = {}
      for (const [key, newValue] of Object.entries(obj)) changes[key] = { newValue }
      listeners.forEach((cb) => cb(changes, 'local'))
    }),
    remove: vi.fn(async (name) => {
      delete disk[name]
    }),
  }

  return {
    chrome: {
      storage: {
        local,
        onChanged: { addListener: (cb) => listeners.push(cb) },
      },
    },
    disk,
    local,
  }
}

// 스토어는 import 시점에 하이드레이션을 시작하는 싱글턴이므로,
// 테스트마다 모듈 레지스트리를 비워 새 인스턴스(=새 탭)를 만든다.
async function loadStore() {
  vi.resetModules()
  const mod = await import('./useSettingStore.js')
  return mod.default
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('useSettingStore 스토리지 안전성', () => {
  it('스토리지 읽기가 실패하면 디스크의 기존 설정을 덮어쓰지 않는다', async () => {
    const saved = makeSavedState()
    const { chrome, disk, local } = createFakeChrome({
      initial: { [STORE_KEY]: saved },
      getBehavior: 'reject',
    })
    vi.stubGlobal('chrome', chrome)

    const store = await loadStore()
    await sleep(50)

    // 읽기 실패 후 앱이 평소처럼 setter를 호출하는 상황
    store.getState().setLastSeenNoticeId(99)
    await sleep(50)

    expect(local.set).not.toHaveBeenCalled()
    expect(disk[STORE_KEY]).toBe(saved)
  })

  it('저장된 JSON이 손상돼도 디스크의 기존 값을 덮어쓰지 않는다', async () => {
    const corrupted = '{"state":{"userName":"타'
    const { chrome, disk, local } = createFakeChrome({
      initial: { [STORE_KEY]: corrupted },
    })
    vi.stubGlobal('chrome', chrome)

    const store = await loadStore()
    await sleep(50)

    store.getState().setCampus('SEOUL')
    await sleep(50)

    expect(local.set).not.toHaveBeenCalled()
    expect(disk[STORE_KEY]).toBe(corrupted)
  })

  it('복원이 끝나기 전에 setter가 호출돼도 저장된 설정이 살아남는다', async () => {
    const { chrome, disk } = createFakeChrome({
      initial: { [STORE_KEY]: makeSavedState() },
      getDelayMs: 100,
    })
    vi.stubGlobal('chrome', chrome)

    const store = await loadStore()

    // 공지 알림 훅처럼, 복원이 끝나기 전에 발생하는 쓰기
    store.getState().setLastSeenNoticeId(99)

    await vi.waitFor(() => expect(store.getState().hasHydrated).toBe(true), { timeout: 2000 })

    expect(store.getState().userName).toBe('테스트유저')
    expect(store.getState().selectedCampus).toBe('GLOBAL')
    expect(JSON.parse(disk[STORE_KEY]).state.userName).toBe('테스트유저')
  })

  it('읽기가 실패하면 hasHydrated가 false로 유지된다', async () => {
    const { chrome } = createFakeChrome({
      initial: { [STORE_KEY]: makeSavedState() },
      getBehavior: 'reject',
    })
    vi.stubGlobal('chrome', chrome)

    const store = await loadStore()
    await sleep(50)

    expect(store.getState().hasHydrated).toBe(false)
  })

  it('정상 복원 시 저장된 설정을 불러오고 이후 변경도 저장된다', async () => {
    const { chrome, disk } = createFakeChrome({
      initial: { [STORE_KEY]: makeSavedState() },
    })
    vi.stubGlobal('chrome', chrome)

    const store = await loadStore()
    await vi.waitFor(() => expect(store.getState().hasHydrated).toBe(true), { timeout: 2000 })

    expect(store.getState().selectedCampus).toBe('GLOBAL')
    expect(store.getState().customBookmarkCount).toBe(6)
    expect(store.getState().userLink.find((l) => l.id === 4).hotLinkName).toBe('내가 추가한 북마크')

    store.getState().setCampus('SEOUL')
    await vi.waitFor(
      () => expect(JSON.parse(disk[STORE_KEY]).state.selectedCampus).toBe('SEOUL'),
      { timeout: 2000 }
    )
  })

  it('탭이 여러 개 열려 있어도 다른 탭의 변경을 덮어쓰지 않는다', async () => {
    const { chrome, disk } = createFakeChrome({
      initial: { [STORE_KEY]: makeSavedState() },
    })
    vi.stubGlobal('chrome', chrome)

    // 탭 A가 먼저 열려서 복원을 마친다
    const tabA = await loadStore()
    await vi.waitFor(() => expect(tabA.getState().hasHydrated).toBe(true), { timeout: 2000 })

    // 이후 탭 B가 열려 설정을 변경한다
    const tabB = await loadStore()
    await vi.waitFor(() => expect(tabB.getState().hasHydrated).toBe(true), { timeout: 2000 })
    tabB.getState().setCampus('SEOUL')

    // 탭 A가 다른 탭의 변경을 전달받아야 한다 (onChanged 동기화가 없으면 GLOBAL로 남아 실패)
    await vi.waitFor(
      () => expect(tabA.getState().selectedCampus).toBe('SEOUL'),
      { timeout: 2000 }
    )

    // 동기화된 뒤 탭 A에서 다른 설정을 건드려도 탭 B의 변경을 지우지 않는다
    tabA.getState().changeBg()
    await sleep(100)

    const finalState = JSON.parse(disk[STORE_KEY]).state
    expect(finalState.selectedCampus).toBe('SEOUL')
    expect(finalState.isDarkMode).toBe(false) // 탭 A의 변경도 함께 살아있다
  })
})

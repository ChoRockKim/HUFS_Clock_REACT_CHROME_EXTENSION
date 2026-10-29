import { test, expect, chromium } from '@playwright/test'
import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const EXT_PATH = path.resolve(__dirname, '../dist')
const STORAGE_KEY = 'hufs-clock-settings'
const BG_COUNT = 3 // campusConfig.js의 캠퍼스별 배경 수 (SEOUL, GLOBAL 모두 낮·밤·눈 3장)
const CAMPUSES = [
  { key: 'SEOUL', label: '서울캠퍼스' },
  { key: 'GLOBAL', label: '글로벌캠퍼스' },
]

function computeExtensionId(absPath) {
  const hash = crypto.createHash('sha256').update(absPath).digest('hex')
  return hash
    .slice(0, 32)
    .split('')
    .map((c) => String.fromCharCode(97 + parseInt(c, 16)))
    .join('')
}

async function resolveExtensionId(context) {
  const page = await context.newPage()
  try {
    await page.goto('chrome://extensions-internals')
    const text = await page.evaluate(() => document.body.innerText)
    const found = JSON.parse(text).find((e) => e?.id)
    if (found?.id) return found.id
  } catch {
    // 아래 폴백 사용
  } finally {
    await page.close()
  }
  return computeExtensionId(EXT_PATH)
}

async function launchWithExtension() {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hufs-clock-e2e-bg-'))
  const context = await chromium.launchPersistentContext(userDataDir, {
    channel: 'chromium',
    args: [`--disable-extensions-except=${EXT_PATH}`, `--load-extension=${EXT_PATH}`],
  })
  const extensionId = await resolveExtensionId(context)
  return { context, userDataDir, appUrl: `chrome-extension://${extensionId}/index.html` }
}

function readSettings(page) {
  return page.evaluate(async (key) => {
    const result = await chrome.storage.local.get(key)
    return result[key] ? JSON.parse(result[key]).state : null
  }, STORAGE_KEY)
}

// .main-background-image-container는 1초짜리 transition이 있어서, 전환 중에는 cross-fade(...)로 읽힌다.
// 비교가 흔들리지 않도록 전환이 끝나 단일 url(...)이 된 값만 돌려준다.
async function currentBg(page) {
  const handle = page.locator('.main-background-image-container')
  let value = ''
  await expect
    .poll(async () => {
      value = await handle.evaluate((el) => getComputedStyle(el).backgroundImage)
      return value.startsWith('url(')
    })
    .toBe(true)
  return value
}

const bgButton = (page) => page.getByRole('button', { name: '배경변경' })

test.beforeAll(() => {
  if (!fs.existsSync(path.join(EXT_PATH, 'manifest.json'))) {
    throw new Error('dist/ 빌드 결과가 없습니다. 먼저 `npm run build`를 실행하세요.')
  }
})

for (const { key, label } of CAMPUSES) {
  test.describe(`배경 순환 — ${key}`, () => {
    let context
    let userDataDir
    let appUrl

    test.beforeEach(async () => {
      ;({ context, userDataDir, appUrl } = await launchWithExtension())
    })

    test.afterEach(async () => {
      await context?.close()
      if (userDataDir) fs.rmSync(userDataDir, { recursive: true, force: true })
    })

    test('버튼을 누를 때마다 배경이 바뀌고 한 바퀴 돌아 처음으로 돌아온다', async () => {
      const page = await context.newPage()
      await page.goto(appUrl)
      await page.getByRole('button', { name: label }).click()
      await expect(bgButton(page)).toBeVisible()
      await expect(bgButton(page)).toHaveText('배경변경')

      const first = await currentBg(page)
      expect(first).toContain('url(')
      const seen = [first]

      for (let i = 1; i < BG_COUNT; i += 1) {
        await bgButton(page).click()
        await expect.poll(() => currentBg(page)).not.toBe(seen[i - 1])
        seen.push(await currentBg(page))
      }
      expect(new Set(seen).size).toBe(BG_COUNT) // 서로 다른 사진
      expect(seen[2]).toContain('snow') // 세 번째는 눈 사진 (빌드 산출물 파일명에 원본 이름이 남는다)
      expect(seen[0]).not.toContain('snow')

      await bgButton(page).click() // 한 바퀴
      await expect.poll(() => currentBg(page)).toBe(first)
      await expect.poll(async () => (await readSettings(page))?.bgIndex).toBe(0)
    })

    test('새로고침·새 탭을 열어도 선택한 배경이 유지된다', async () => {
      const page = await context.newPage()
      await page.goto(appUrl)
      await page.getByRole('button', { name: label }).click()
      const first = await currentBg(page)
      await bgButton(page).click()
      await expect.poll(() => currentBg(page)).not.toBe(first)
      const chosen = await currentBg(page)
      await expect.poll(async () => (await readSettings(page))?.bgIndex).toBe(1)

      await page.reload()
      await expect(bgButton(page)).toBeVisible()
      await expect.poll(() => currentBg(page)).toBe(chosen)

      await page.close()
      const reopened = await context.newPage()
      await reopened.goto(appUrl)
      await expect(bgButton(reopened)).toBeVisible()
      await expect.poll(() => currentBg(reopened)).toBe(chosen)
    })

    test('isDarkMode만 있는 구버전 저장 데이터로 열어도 북마크·이름이 보존된다', async () => {
      const legacy = {
        state: {
          isDarkMode: true,
          selectedCampus: key,
          userName: '구버전유저',
          enterYear: '21',
          inCartCourse: [],
          lastSeenNoticeId: null,
          customBookmarkCount: 4,
          isBookmarkPinned: false,
          userLink: [
            { id: 0, hotLinkName: '🏛️ 홈페이지', hotLink: 'https://www.hufs.ac.kr', custom: false },
            { id: 1, hotLinkName: '✏️ E-class', hotLink: 'https://eclass.hufs.ac.kr', custom: false },
            { id: 2, hotLinkName: '📖 종정시', hotLink: 'https://wis.hufs.ac.kr', custom: false },
            { id: 3, hotLinkName: '🏢 Ability', hotLink: 'https://hufsability.hufs.ac.kr', custom: false },
            { id: 4, hotLinkName: '내북마크', hotLink: 'https://example.com', custom: true },
          ],
        },
        version: 1,
      }

      // 구버전 데이터를 미리 넣어 두고, 그 페이지를 닫은 뒤 새로 연다
      const seeder = await context.newPage()
      await seeder.goto(appUrl)
      await seeder.evaluate(
        ([k, v]) => chrome.storage.local.set({ [k]: v }),
        [STORAGE_KEY, JSON.stringify(legacy)],
      )
      await seeder.close()

      const page = await context.newPage()
      await page.goto(appUrl)
      await expect(bgButton(page)).toBeVisible()
      await expect(page.getByText('내북마크')).toBeVisible()
      expect(await currentBg(page)).toContain('url(')

      // 배경을 한 번 바꿔 저장이 일어나게 한 뒤에도 데이터가 남아 있어야 한다
      await bgButton(page).click()
      await expect.poll(async () => (await readSettings(page))?.bgIndex).toBe(1)
      const saved = await readSettings(page)
      expect(saved.userName).toBe('구버전유저')
      expect(saved.enterYear).toBe('21')
      expect(saved.selectedCampus).toBe(key)
      expect(saved.userLink).toEqual(legacy.state.userLink)

      await page.reload()
      await expect(page.getByText('내북마크')).toBeVisible()
    })
  })
}

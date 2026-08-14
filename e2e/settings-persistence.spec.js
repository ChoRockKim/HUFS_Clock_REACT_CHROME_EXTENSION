import { test, expect, chromium } from '@playwright/test'
import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const EXT_PATH = path.resolve(__dirname, '../dist')
const STORAGE_KEY = 'hufs-clock-settings'

// 언팩 확장 프로그램의 ID는 절대경로의 SHA-256에서 유도된다 (a~p 알파벳으로 변환)
function computeExtensionId(absPath) {
  const hash = crypto.createHash('sha256').update(absPath).digest('hex')
  return hash
    .slice(0, 32)
    .split('')
    .map((c) => String.fromCharCode(97 + parseInt(c, 16)))
    .join('')
}

async function resolveExtensionId(context) {
  // 이 확장은 백그라운드 서비스워커가 없어서 context.serviceWorkers()로 ID를 못 얻는다.
  // chrome://extensions-internals의 JSON에서 읽고, 실패하면 경로 해시로 계산한다.
  const page = await context.newPage()
  try {
    await page.goto('chrome://extensions-internals')
    const text = await page.evaluate(() => document.body.innerText)
    const parsed = JSON.parse(text)
    const found = parsed.find((e) => e?.id)
    if (found?.id) return found.id
  } catch {
    // 아래 폴백 사용
  } finally {
    await page.close()
  }
  return computeExtensionId(EXT_PATH)
}

async function launchWithExtension() {
  const userDataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'hufs-clock-e2e-'))
  const context = await chromium.launchPersistentContext(userDataDir, {
    channel: 'chromium',
    args: [`--disable-extensions-except=${EXT_PATH}`, `--load-extension=${EXT_PATH}`],
  })
  const extensionId = await resolveExtensionId(context)
  const appUrl = `chrome-extension://${extensionId}/index.html`
  return { context, userDataDir, appUrl }
}

function readSettings(page) {
  return page.evaluate(async (key) => {
    const result = await chrome.storage.local.get(key)
    return result[key] ? JSON.parse(result[key]).state : null
  }, STORAGE_KEY)
}

test.beforeAll(() => {
  if (!fs.existsSync(path.join(EXT_PATH, 'manifest.json'))) {
    throw new Error('dist/ 빌드 결과가 없습니다. 먼저 `npm run build`를 실행하세요.')
  }
})

test.describe('확장 프로그램 설정 영속성', () => {
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

  test('캠퍼스를 선택하면 chrome.storage.local에 저장된다', async () => {
    const page = await context.newPage()
    await page.goto(appUrl)

    await page.getByRole('button', { name: '서울캠퍼스' }).click()

    await expect
      .poll(async () => (await readSettings(page))?.selectedCampus)
      .toBe('SEOUL')
  })

  test('탭을 여러 개 동시에 열어도 설정이 초기화되지 않는다', async () => {
    const first = await context.newPage()
    await first.goto(appUrl)
    await first.getByRole('button', { name: '글로벌캠퍼스' }).click()
    await expect
      .poll(async () => (await readSettings(first))?.selectedCampus)
      .toBe('GLOBAL')

    // 새 탭 확장이므로 사용자가 탭을 여러 개 여는 상황을 그대로 재현한다
    const tabs = []
    for (let i = 0; i < 5; i += 1) {
      const tab = await context.newPage()
      await tab.goto(appUrl)
      tabs.push(tab)
    }

    for (const tab of tabs) {
      await expect.poll(async () => (await readSettings(tab))?.selectedCampus).toBe('GLOBAL')
    }
    await expect.poll(async () => (await readSettings(first))?.selectedCampus).toBe('GLOBAL')
  })

  test('열고 새로고침을 반복해도 기본값으로 되돌아가지 않는다', async () => {
    const page = await context.newPage()
    await page.goto(appUrl)
    await page.getByRole('button', { name: '서울캠퍼스' }).click()
    await expect.poll(async () => (await readSettings(page))?.selectedCampus).toBe('SEOUL')

    for (let i = 0; i < 10; i += 1) {
      await page.reload()
      await expect.poll(async () => (await readSettings(page))?.selectedCampus).toBe('SEOUL')
    }
  })

  test('스토리지 읽기가 실패한 탭이 열려도 저장된 설정이 지워지지 않는다', async () => {
    const page = await context.newPage()
    await page.goto(appUrl)
    await page.getByRole('button', { name: '서울캠퍼스' }).click()
    await expect.poll(async () => (await readSettings(page))?.selectedCampus).toBe('SEOUL')

    // 읽기가 실패하는 탭을 연다 (확장 업데이트 중 컨텍스트 무효화 등을 재현)
    const brokenTab = await context.newPage()
    await brokenTab.addInitScript(() => {
      chrome.storage.local.get = () => Promise.reject(new Error('injected read failure'))
    })
    await brokenTab.goto(appUrl)
    await brokenTab.waitForTimeout(2000)

    // 읽기가 멀쩡한 다른 탭에서 디스크 상태를 확인한다
    const healthyTab = await context.newPage()
    await healthyTab.goto(appUrl)
    await expect
      .poll(async () => (await readSettings(healthyTab))?.selectedCampus)
      .toBe('SEOUL')
  })
})

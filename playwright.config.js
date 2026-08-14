import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  // 확장 프로그램을 실제로 로드해 띄우므로 병렬 실행하지 않는다
  workers: 1,
  fullyParallel: false,
  timeout: 60000,
  expect: { timeout: 15000 },
  reporter: 'list',
})

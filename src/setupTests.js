import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'

// vite.config.js에서 test.globals를 켜지 않았으므로,
// @testing-library/react가 자동으로 못 찾는 afterEach cleanup을 직접 등록
afterEach(() => {
  cleanup()
})

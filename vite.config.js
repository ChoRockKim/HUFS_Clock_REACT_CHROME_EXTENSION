import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    // e2e/는 Playwright가 실행하므로 vitest 대상에서 제외한다
    exclude: ['node_modules', 'dist', 'e2e'],
  },
})

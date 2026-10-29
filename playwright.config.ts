import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  timeout: 30_000,
  reporter: [['list']],
  use: { baseURL: 'http://127.0.0.1:4173', screenshot: 'only-on-failure' },
  webServer: { command: 'npm.cmd run preview -- --host 127.0.0.1', url: 'http://127.0.0.1:4173', reuseExistingServer: true },
})

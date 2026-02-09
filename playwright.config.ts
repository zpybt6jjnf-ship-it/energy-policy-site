import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./qa",
  outputDir: "./qa/screenshots/test-results",
  snapshotPathTemplate:
    "qa/baselines/{projectName}/{testFilePath}/{arg}{ext}",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "list",
  use: {
    baseURL: "http://localhost:3456",
  },
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
    },
  },
  webServer: {
    command: "npx serve out -p 3456",
    port: 3456,
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1280, height: 720 },
      },
    },
    {
      name: "mobile",
      use: {
        ...devices["Pixel 5"],
        viewport: { width: 375, height: 812 },
      },
    },
  ],
});

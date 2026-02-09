import { test, expect } from "@playwright/test";

const routes = [
  { path: "/", name: "home" },
  { path: "/reliability", name: "reliability" },
  { path: "/affordability", name: "affordability" },
  { path: "/generation-mix", name: "generation-mix" },
  { path: "/environmental", name: "environmental" },
  { path: "/market-trends", name: "market-trends" },
  { path: "/land-use", name: "land-use" },
  { path: "/methodology", name: "methodology" },
];

for (const route of routes) {
  test(`${route.name} matches baseline`, async ({ page }) => {
    await page.goto(route.path, { waitUntil: "networkidle" });

    // Wait for Recharts SVGs to render (skip for pages without charts)
    const hasSvg = await page.locator(".recharts-wrapper").count();
    if (hasSvg > 0) {
      await page.locator(".recharts-wrapper svg").first().waitFor({ timeout: 10000 });
      // Give animations time to settle
      await page.waitForTimeout(1000);
    }

    await expect(page).toHaveScreenshot(`${route.name}.png`, {
      fullPage: true,
    });
  });
}

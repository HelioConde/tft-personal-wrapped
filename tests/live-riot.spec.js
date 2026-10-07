const { test, expect } = require("@playwright/test");

test.describe("Live Riot smoke", () => {
  test.skip(process.env.LIVE_RIOT_SMOKE !== "1", "Runs only in the dedicated live Riot workflow.");

  test("loads the published TFT Wrapped with a real Riot ID", async ({ page }) => {
    await page.goto("/?riotId=AlchemyFlames%23BR1&server=br1&period=month&lang=pt", {
      waitUntil: "domcontentloaded"
    });

    const status = page.locator("[data-mode-label]");
    await expect(status).toBeVisible();

    await expect
      .poll(async () => (await status.textContent())?.trim() || "", {
        timeout: 25000,
        message: "The live lookup should leave the loading/demo state."
      })
      .toMatch(/Dados Riot reais|Nenhuma partida TFT encontrada/i);

    await expect(page.locator("[data-search] input[name=riotId]")).toHaveValue("AlchemyFlames#BR1");
    await expect(page.locator("[data-metric=games]")).toBeVisible();
    await expect(page.locator("[data-dashboard]")).toBeVisible();
  });
});

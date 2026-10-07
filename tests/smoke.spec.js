const { test, expect } = require("@playwright/test");

const livePayload = {
  player: { gameName: "AlchemyFlames", tagLine: "BR1", platform: "BR1", level: 100 },
  summary: { matches: 3, averagePlacement: 2.67, top4Rate: 100, winRate: 33, firsts: 1, eighths: 0 },
  matches: [
    {
      id: "BR1_1", playedAt: Date.now() - 86400000, placement: 1, setNumber: 18, setName: "Set 18",
      traits: [{ name: "TFT18_Sorcerer", style: 2, tierCurrent: 2 }],
      units: [{ characterId: "TFT18_Ahri" }, { characterId: "TFT18_Taric" }],
      augments: ["TFT_Augment_JeweledLotus"]
    },
    {
      id: "BR1_2", playedAt: Date.now() - 2 * 86400000, placement: 3, setNumber: 18, setName: "Set 18",
      traits: [{ name: "TFT18_Sorcerer", style: 2, tierCurrent: 2 }],
      units: [{ characterId: "TFT18_Ahri" }, { characterId: "TFT18_Shen" }],
      augments: ["TFT_Augment_JeweledLotus"]
    },
    {
      id: "BR1_3", playedAt: Date.now() - 5 * 86400000, placement: 4, setNumber: 18, setName: "Set 18",
      traits: [{ name: "TFT18_Bastion", style: 2, tierCurrent: 2 }],
      units: [{ characterId: "TFT18_Taric" }, { characterId: "TFT18_Shen" }],
      augments: ["TFT_Augment_PandorasItems"]
    }
  ]
};

async function mockRiot(page) {
  await page.route("**/riot-legacy-tft-profile", async route => {
    await route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(livePayload) });
  });
}

test("loads real TFT data and recalculates the wrapped", async ({ page }) => {
  await mockRiot(page);
  await page.goto("/");
  await page.getByLabel("Riot ID").fill("AlchemyFlames#BR1");
  await page.getByRole("button", { name: "Ver meu Wrapped" }).click();

  await expect(page.locator("[data-mode-label]")).toContainText("Dados Riot reais");
  await expect(page.locator('[data-metric="games"]')).toHaveText("3");
  await expect(page.locator('[data-metric="top4"]')).toHaveText("100%");
  await expect(page.locator("[data-comps]")).toContainText("Sorcerer");
});

test("persists English and remains usable on mobile without horizontal overflow", async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  await page.locator("[data-lang]").click();
  await expect(page.getByRole("button", { name: "See my Wrapped" })).toBeVisible();

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow).toBeLessThanOrEqual(1);
});

test("handles Riot rate limit without crashing", async ({ page }) => {
  await page.route("**/riot-legacy-tft-profile", async route => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({ _transportError: { code: "rate_limited", status: 429 } })
    });
  });
  await page.goto("/");
  await page.getByLabel("Riot ID").fill("AlchemyFlames#BR1");
  await page.getByRole("button", { name: "Ver meu Wrapped" }).click();
  await expect(page.locator("[data-mode-label]")).toContainText("Limite temporario");
});

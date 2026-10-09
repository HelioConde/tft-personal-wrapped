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
  await page.route("**/public-tft-profile", async route => {
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
  await page.route("**/public-tft-profile", async route => {
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


test("discloses an older cached Riot result instead of calling it current", async ({ page }) => {
  await page.route("**/public-tft-profile", route => route.fulfill({
    status: 200,
    contentType: "application/json",
    body: JSON.stringify({ ...livePayload, cacheMeta: { stale: true, snapshotDate: "2026-09-01" } })
  }));
  await page.goto("/");
  await page.getByLabel("Riot ID").fill("AlchemyFlames#BR1");
  await page.getByRole("button", { name: "Ver meu Wrapped" }).click();
  await expect(page.locator("[data-mode-label]")).toContainText("salvos anteriormente");
  await expect(page.locator('[data-metric="games"]')).toHaveText("3");
});

test("does not silently truncate invalid Riot IDs before calling the backend", async ({ page }) => {
  let calls = 0;
  await page.route("**/public-tft-profile", route => {
    calls += 1;
    return route.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify(livePayload) });
  });
  await page.goto("/");
  await page.getByLabel("Riot ID").fill("VeryLongGameName17#BR1");
  await page.getByRole("button", { name: "Ver meu Wrapped" }).click();
  await expect(page.locator("[data-mode-label]")).toContainText("formato Nome#TAG");
  expect(calls).toBe(0);
});

test("a second Riot search wins even when the previous request resolves later", async ({ page }) => {
  await page.route("**/public-tft-profile", async route => {
    const body = route.request().postDataJSON();
    if (body.gameName === "SlowPlayer") await new Promise(resolve => setTimeout(resolve, 900));
    try {
      await route.fulfill({
        status: 200, contentType: "application/json",
        body: JSON.stringify({ ...livePayload, player: { ...livePayload.player, gameName: body.gameName } })
      });
    } catch { /* The first request may be cancelled as intended. */ }
  });
  await page.goto("/");
  await page.getByLabel("Riot ID").fill("SlowPlayer#BR1");
  await page.getByRole("button", { name: "Ver meu Wrapped" }).click();
  await page.getByLabel("Riot ID").fill("FastPlayer#BR1");
  await page.getByRole("button", { name: "Ver meu Wrapped" }).click();
  await expect(page.locator("[data-feature-summary]")).toContainText("FastPlayer#BR1");
  await page.waitForTimeout(1100);
  await expect(page.locator("[data-feature-summary]")).not.toContainText("SlowPlayer#BR1");
});


test("privacy, Riot attribution and sample limit remain accessible in both languages", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-i18n=sample]")).toContainText("até 20 partidas");
  await page.locator("[data-lang]").click();
  await expect(page.locator("[data-i18n=sample]")).toContainText("up to 20 recent Riot matches");
  await page.locator('footer a[href="privacidade.html"]').click();
  await expect(page.getByRole("heading", { name: "Transparência sobre sua retrospectiva." })).toBeVisible();
  await expect(page.locator("main")).toContainText("não o histórico completo");
});

test("identifies an empty historical cache as unavailable, not a real empty set", async ({ page }) => {
  await page.route("**/public-tft-profile", route => route.fulfill({
    status: 200, contentType: "application/json",
    body: JSON.stringify({ player: livePayload.player, matches: [], summary: { matches: 0 }, cacheMeta: { stale: true } })
  }));
  await page.goto("/");
  await page.getByLabel("Riot ID").fill("AlchemyFlames#BR1");
  await page.getByRole("button", { name: "Ver meu Wrapped" }).click();
  await expect(page.locator("[data-mode-label]")).toContainText("cache antigo não contém partidas");
});

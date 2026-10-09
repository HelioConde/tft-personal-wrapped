// Live Riot smoke is intentionally independent from GitHub Pages setup.
// The legacy wrapper can return HTTP 200 containing empty stale cache data,
// which MUST NOT count as a successful fresh profile lookup.
const base = "https://bieihhaobdztjyoweewa.supabase.co/functions/v1";
const payload = {
  gameName: process.env.TFT_GAME_NAME || "AlchemyFlames",
  tagLine: process.env.TFT_TAG_LINE || "BR1",
  platform: process.env.TFT_PLATFORM || "br1"
};

async function check(slug) {
  const start = Date.now();
  const res = await fetch(base + "/" + slug, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(45000)
  });
  const data = await res.json().catch(() => ({}));
  const stale = data?.cacheMeta?.stale === true;
  const error = data?._transportError || data?.error || (res.ok ? null : res.status);
  const matches = Array.isArray(data?.matches) ? data.matches.length : -1;
  console.log(slug + ":", JSON.stringify({
    httpStatus: res.status, providerError: error, stale,
    matches, elapsedMs: Date.now() - start,
    player: data?.player?.gameName ? data.player.gameName + "#" + data.player.tagLine : null
  }));
  return { data, stale, error, matches, ok: res.ok };
}

const direct = await check("public-tft-profile");
if (!direct.ok || direct.error || !direct.data?.player?.gameName || direct.matches < 0 || !direct.data?.summary) {
  // Diagnose the fallback, but do not treat a cached shell response as live success.
  await check("riot-legacy-tft-profile").catch(error => console.error("legacy fallback:", error.message));
  throw new Error("Fresh Riot TFT profile unavailable; fallback snapshots are not fresh match history.");
}
for (const match of direct.data.matches) {
  if (!Number.isFinite(Number(match?.placement)) ||
      !Array.isArray(match?.units) ||
      !Array.isArray(match?.augments)) {
    throw new Error("Riot TFT match contract missing placement/units/augments");
  }
}
if (direct.matches === 0) {
  console.log("Fresh Riot query is valid but this account has no loaded TFT matches; visual recap still requires a TFT player with match history.");
} else {
  console.log("Fresh Riot TFT sample validated with", direct.matches, "matches.");
}

// Validates the real Riot-backed TFT API without depending on GitHub Pages being enabled.
const endpoint = "https://bieihhaobdztjyoweewa.supabase.co/functions/v1/riot-legacy-tft-profile";
const gameName = process.env.TFT_GAME_NAME || "AlchemyFlames";
const tagLine = process.env.TFT_TAG_LINE || "BR1";
const platform = process.env.TFT_PLATFORM || "br1";

const response = await fetch(endpoint, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ gameName, tagLine, platform }),
  signal: AbortSignal.timeout(35000)
});
const payload = await response.json().catch(() => ({}));
const failure = payload?._transportError;
console.log("TFT backend HTTP:", response.status);
console.log("Riot backend status:", failure?.status || (response.ok ? 200 : response.status));
console.log("Source:", payload?.cacheMeta?.stale ? "previously cached Riot data" : "live Riot response");

if (!response.ok || failure || payload?.error) {
  throw new Error("TFT API could not return real profile: " + String(failure?.code || payload?.error || response.status));
}
if (!payload?.player?.gameName || !payload?.player?.tagLine) {
  throw new Error("TFT API missing player identity");
}
if (!Array.isArray(payload?.matches) || !payload?.summary || typeof payload?.summary !== "object") {
  throw new Error("TFT API missing match/summary contract");
}
if (payload.matches.some(match => !Number.isFinite(Number(match?.placement)) || !Array.isArray(match?.units) || !Array.isArray(match?.augments))) {
  throw new Error("TFT matches violate expected units/augments/placement shape");
}
console.log("Riot ID:", payload.player.gameName + "#" + payload.player.tagLine);
console.log("Returned matches:", payload.matches.length);
console.log("Sample placement:", payload.summary.averagePlacement ?? "none");
// This backend returns up to 20 recent matches. Never describe this as a complete set history.
console.log("Result: real TFT backend contract passed (recent sample only).");

(() => {
  const existing = window.TFT_WRAPPED_BACKEND || {};
  const functionsBase = typeof existing.functionsBase === "string" && existing.functionsBase
    ? existing.functionsBase.replace(/\/$/, "")
    : "https://bieihhaobdztjyoweewa.supabase.co/functions/v1";
  window.TFT_WRAPPED_BACKEND = Object.freeze({
    functionsBase,
    // The legacy wrapper times out upstream after 5.5s and can return empty stale snapshots.
    // The direct endpoint was verified with 20 real matches on 2026-10-09.
    tftProfile: existing.tftProfile || functionsBase + "/public-tft-profile",
    source: "zerotwo-gamer-supabase"
  });
})();

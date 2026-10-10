/* Optional visual pack. No image requests or layout jumps until assets exist. */
(() => {
  const root = "assets/tft-wrapped/";
  const ready = window.TFT_WRAPPED_ASSETS_ENABLED === true;
  if (!ready) return;
  const knownIcons = new Set(["crown","swords","shield","star","analytics","share","augment","mascot","lock","search"]);
  const knownIllustrations = new Set(["hero-cosmic-arena","search-riot-id","recent-matches","share-wrapped","favorite-comps","augments-and-units","placements-and-records","mobile-wrapped","privacy-archive","demo-mode"]);
  for (const el of document.querySelectorAll("[data-art-icon]")) {
    const id = el.dataset.artIcon;
    if (!knownIcons.has(id)) continue;
    const image = new Image();
    image.src = root + "icons/" + id + ".webp";
    image.alt = "";
    image.width = 40;
    image.height = 40;
    image.decoding = "async";
    image.onload = () => { el.replaceChildren(image); el.classList.add("art-loaded"); };
  }
  for (const el of document.querySelectorAll("[data-art-illustration]")) {
    const id = el.dataset.artIllustration;
    if (!knownIllustrations.has(id)) continue;
    const image = new Image();
    image.src = root + "illustrations/" + id + ".webp";
    image.alt = "";
    image.decoding = "async";
    image.loading = id === "hero-cosmic-arena" ? "eager" : "lazy";
    image.onload = () => { el.replaceChildren(image); el.classList.add("art-loaded"); };
  }
})();
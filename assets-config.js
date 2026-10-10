/* Optional 20-file WebP artwork bundle. Never request absent assets. */
(() => {
  if (window.TFT_WRAPPED_ASSETS_ENABLED !== true) return;

  const root = new URL("assets/tft-wrapped/", document.baseURI);
  const icons = new Set([
    "crown", "swords", "shield", "star", "analytics",
    "share", "augment", "mascot", "lock", "search"
  ]);
  const illustrations = new Set([
    "hero-cosmic-arena", "search-riot-id", "recent-matches",
    "share-wrapped", "favorite-comps", "augments-and-units",
    "placements-and-records", "mobile-wrapped", "privacy-archive", "demo-mode"
  ]);
  document.documentElement.classList.add("tft-art-enabled");

  function addImage(element, folder, name, priority = "low") {
    const img = new Image();
    img.alt = "";
    img.decoding = "async";
    img.setAttribute("aria-hidden", "true");
    img.fetchPriority = priority;
    if (folder === "icons") {
      img.width = 40;
      img.height = 40;
    }
    img.onload = () => {
      element.replaceChildren(img);
      element.classList.add("art-loaded");
    };
    img.onerror = () => {
      // A missing/corrupt image must not remove visible text or crash the page.
      element.replaceChildren();
      element.classList.remove("art-loaded");
    };
    img.src = new URL(folder + "/" + name + ".webp", root).href;
  }

  for (const element of document.querySelectorAll("[data-art-icon]")) {
    const name = element.dataset.artIcon;
    if (icons.has(name)) addImage(element, "icons", name);
  }

  const artwork = [...document.querySelectorAll("[data-art-illustration]")]
    .filter(element => illustrations.has(element.dataset.artIllustration));
  const loadArtwork = element => {
    if (element.dataset.artRequested === "true") return;
    element.dataset.artRequested = "true";
    const name = element.dataset.artIllustration;
    addImage(element, "illustrations", name, name === "hero-cosmic-arena" ? "high" : "low");
  };

  // Watch the visible containing card, not the hidden artwork container:
  // IntersectionObserver never intersects elements with display:none.
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const target = entry.target;
        observer.unobserve(target);
        for (const element of artwork) {
          if ((element.closest(".panel, .step-card, .visual-note") || element) === target) {
            loadArtwork(element);
          }
        }
      }
    }, { rootMargin: "250px" });
    const targets = new Set(artwork.map(element =>
      element.closest(".panel, .step-card, .visual-note") || element));
    targets.forEach(element => observer.observe(element));
  } else {
    artwork.forEach(loadArtwork);
  }
})();

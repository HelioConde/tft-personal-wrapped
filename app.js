const demo = {
  week: { games: 8, avg: "3,9", top4: "63%", wins: 2, comps: [["Feiticeiros", 5], ["Bastiao", 4], ["Flex AD", 3]], units: [["Ahri", 7], ["Taric", 6], ["Shen", 5], ["Kai'Sa", 5], ["Janna", 4]], augments: [["Jeweled Lotus", 4, "3,2"], ["Pandora's Items", 3, "3,7"], ["Tiny Titans", 2, "2,5"]], placements: [2,1,0,1,2,1,1,0], identity: "Flex" },
  month: { games: 23, avg: "4,1", top4: "61%", wins: 4, comps: [["Feiticeiros", 11], ["Bastiao", 9], ["Flex AD", 7]], units: [["Ahri", 18], ["Taric", 15], ["Shen", 14], ["Kai'Sa", 12], ["Janna", 11]], augments: [["Jeweled Lotus", 8, "3,4"], ["Pandora's Items", 7, "3,8"], ["Tiny Titans", 5, "3,1"]], placements: [4,3,3,4,3,2,2,2], identity: "Flex" },
  set: { games: 86, avg: "4,3", top4: "56%", wins: 11, comps: [["Feiticeiros", 31], ["Bastiao", 24], ["Flex AD", 22]], units: [["Ahri", 53], ["Taric", 49], ["Shen", 45], ["Kai'Sa", 41], ["Janna", 36]], augments: [["Jeweled Lotus", 19, "3,6"], ["Pandora's Items", 18, "4,0"], ["Tiny Titans", 13, "3,5"]], placements: [11,10,12,15,10,9,11,8], identity: "Flex" }
};

const copy = {
  pt: {
    loading: "Consultando seu historico TFT...",
    demo: "Modo demonstrativo — pesquise um Riot ID para carregar dados reais.",
    live: "Dados Riot reais · amostra recente disponivel",
    empty: "Nenhuma partida TFT encontrada neste periodo.",
    invalid: "Use um Riot ID no formato Nome#TAG.",
    notFound: "Riot ID nao encontrado.",
    rate: "Limite temporario da Riot atingido. Tente novamente em instantes.",
    error: "Nao foi possivel consultar a Riot agora. O modo demonstrativo continua disponivel.",
    games: "partidas",
    average: "media",
    best: "Melhor colocacao",
    streak: "Maior sequencia Top 4",
    bestComp: "Comp de melhor media",
    identitySuffix: "foi a identidade mais forte da amostra neste periodo."
  },
  en: {
    loading: "Loading your TFT history...",
    demo: "Demo mode — search a Riot ID to load live data.",
    live: "Live Riot data · recent sample available",
    empty: "No TFT matches were found for this period.",
    invalid: "Use a Riot ID in the Name#TAG format.",
    notFound: "Riot ID was not found.",
    rate: "Riot rate limit is temporarily active. Try again shortly.",
    error: "Riot data is unavailable right now. Demo mode remains available.",
    games: "games",
    average: "average",
    best: "Best placement",
    streak: "Longest Top 4 streak",
    bestComp: "Best average comp",
    identitySuffix: "was the strongest identity in this period sample."
  }
};

const i18n = {
  pt: {
    eyebrow: "Sua historia recente no TFT",
    hero: "Seu set, contado como uma historia.",
    sub: "Menos tabela, mais memoria: descubra suas comps favoritas, augments marcantes, melhores resultados e recordes do periodo.",
    search: "Ver meu Wrapped",
    identity: "Identidade do periodo",
    comps: "Comps que definiram seu periodo",
    placements: "Colocacoes",
    units: "Unidades mais presentes",
    augments: "Augments marcantes",
    records: "Seus recordes",
    share: "Compartilhar",
    shareTitle: "Seu TFT Wrapped em um card.",
    shareText: "Gere um PNG com os destaques do periodo e compartilhe seu resultado.",
    generate: "Gerar card"
  },
  en: {
    eyebrow: "Your recent TFT story",
    hero: "Your set, told like a story.",
    sub: "Less spreadsheet, more memory: see your favorite comps, standout augments, best finishes and personal records.",
    search: "See my Wrapped",
    identity: "Period identity",
    comps: "Comps that defined your period",
    placements: "Placements",
    units: "Most played units",
    augments: "Standout augments",
    records: "Your records",
    share: "Share",
    shareTitle: "Your TFT Wrapped in one card.",
    shareText: "Generate a PNG with the period highlights and share your result.",
    generate: "Generate card"
  }
};

let period = "month";
let lang = localStorage.getItem("tft-wrapped-lang") || "pt";
let source = "demo";
let liveMatches = [];
let currentPlayer = null;
let currentLookup = null;
let currentData = demo.month;

const $ = selector => document.querySelector(selector);
const esc = value => String(value == null ? "" : value).replace(/[&<>"']/g, char => ({
  "&":"&amp;", "<":"&lt;", ">":"&gt;", "\"":"&quot;", "'":"&#39;"
})[char]);
const locale = () => lang === "pt" ? "pt-BR" : "en-US";
const fmt = value => Number(value || 0).toLocaleString(locale());
const dec = value => Number(value || 0).toLocaleString(locale(), { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function cleanName(value) {
  return String(value || "")
    .replace(/^TFT\d+_/i, "")
    .replace(/^TFT_?/i, "")
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .trim() || "—";
}

function setStatus(key) {
  const element = $("[data-mode-label]");
  if (element) element.textContent = copy[lang][key] || key;
}

function parseRiotId(value) {
  const raw = String(value || "").trim();
  const split = raw.lastIndexOf("#");
  if (split <= 0) return null;
  const gameName = raw.slice(0, split).trim();
  const tagLine = raw.slice(split + 1).trim();
  if (!gameName || !tagLine) return null;
  return { gameName: gameName.slice(0, 16), tagLine: tagLine.slice(0, 5) };
}

function matchesForPeriod() {
  const sorted = liveMatches.slice().sort((a, b) => Number(b.playedAt || 0) - Number(a.playedAt || 0));
  if (period === "set") {
    const newest = sorted.find(match => Number(match.setNumber) > 0);
    return newest ? sorted.filter(match => Number(match.setNumber) === Number(newest.setNumber)) : sorted;
  }
  const days = period === "week" ? 7 : 30;
  const cutoff = Date.now() - days * 86400000;
  return sorted.filter(match => Number(match.playedAt || 0) >= cutoff);
}

function compLabel(match) {
  const traits = (Array.isArray(match.traits) ? match.traits : [])
    .filter(trait => Number(trait.style || 0) > 0 || Number(trait.tierCurrent || 0) > 0)
    .sort((a, b) => Number(b.style || b.tierCurrent || 0) - Number(a.style || a.tierCurrent || 0))
    .slice(0, 2)
    .map(trait => cleanName(trait.name))
    .filter(Boolean);
  if (traits.length) return traits.join(" + ");
  const units = (Array.isArray(match.units) ? match.units : []).slice(0, 2).map(unit => cleanName(unit.characterId));
  return units.filter(Boolean).join(" + ") || (lang === "pt" ? "Composicao flex" : "Flexible board");
}

function aggregate(matches) {
  const valid = matches.filter(match => Number(match.placement) >= 1 && Number(match.placement) <= 8);
  if (!valid.length) {
    return { games: 0, avg: "—", top4: "—", wins: 0, comps: [], units: [], augments: [], placements: [0,0,0,0,0,0,0,0], identity: "—", records: [] };
  }

  const placementCounts = Array(8).fill(0);
  valid.forEach(match => placementCounts[Number(match.placement) - 1] += 1);
  const average = valid.reduce((sum, match) => sum + Number(match.placement), 0) / valid.length;
  const top4 = valid.filter(match => Number(match.placement) <= 4).length;
  const wins = valid.filter(match => Number(match.placement) === 1).length;

  const compMap = new Map();
  valid.forEach(match => {
    const name = compLabel(match);
    const row = compMap.get(name) || { name, count: 0, placements: [] };
    row.count += 1;
    row.placements.push(Number(match.placement));
    compMap.set(name, row);
  });
  const compRows = Array.from(compMap.values()).map(row => ({
    name: row.name,
    count: row.count,
    avg: row.placements.reduce((sum, value) => sum + value, 0) / row.placements.length
  })).sort((a, b) => b.count - a.count || a.avg - b.avg);

  const unitMap = new Map();
  valid.forEach(match => (Array.isArray(match.units) ? match.units : []).forEach(unit => {
    const name = cleanName(unit.characterId);
    if (name !== "—") unitMap.set(name, (unitMap.get(name) || 0) + 1);
  }));

  const augmentMap = new Map();
  valid.forEach(match => (Array.isArray(match.augments) ? match.augments : []).forEach(augment => {
    const name = cleanName(augment);
    if (name === "—") return;
    const row = augmentMap.get(name) || { count: 0, placements: [] };
    row.count += 1;
    row.placements.push(Number(match.placement));
    augmentMap.set(name, row);
  }));

  const chronological = valid.slice().sort((a, b) => Number(a.playedAt || 0) - Number(b.playedAt || 0));
  let streak = 0;
  let maxStreak = 0;
  chronological.forEach(match => {
    streak = Number(match.placement) <= 4 ? streak + 1 : 0;
    maxStreak = Math.max(maxStreak, streak);
  });

  const bestComp = compRows.filter(row => row.count >= 2).sort((a, b) => a.avg - b.avg)[0] || compRows[0];
  const bestPlacement = Math.min.apply(null, valid.map(match => Number(match.placement)));

  return {
    games: valid.length,
    avg: dec(average),
    top4: Math.round(top4 / valid.length * 100) + "%",
    wins,
    placements: placementCounts,
    comps: compRows.slice(0, 3).map(row => [row.name, row.count]),
    units: Array.from(unitMap.entries()).sort((a, b) => b[1] - a[1]).slice(0, 5),
    augments: Array.from(augmentMap.entries()).map(entry => {
      const row = entry[1];
      return [entry[0], row.count, dec(row.placements.reduce((a, b) => a + b, 0) / row.placements.length)];
    }).sort((a, b) => b[1] - a[1]).slice(0, 5),
    identity: compRows.length === 1 ? compRows[0].name : (compRows[0].count >= Math.max(2, Math.ceil(valid.length * 0.45)) ? compRows[0].name : "Flex"),
    records: [
      [copy[lang].best, String(bestPlacement) + "º" + (wins ? " · " + wins + "x 1º" : "")],
      [copy[lang].streak, String(maxStreak)],
      [copy[lang].bestComp, bestComp ? bestComp.name + " · " + dec(bestComp.avg) : "—"]
    ]
  };
}

function demoRecords(data) {
  return [
    [copy[lang].best, data.wins ? "1º · " + data.wins + "x" : "—"],
    [copy[lang].streak, period === "week" ? "4" : period === "month" ? "5" : "6"],
    [copy[lang].bestComp, data.comps[0] ? data.comps[0][0] : "—"]
  ];
}

function render() {
  const data = source === "live" ? aggregate(matchesForPeriod()) : demo[period];
  currentData = data;
  const records = data.records && data.records.length ? data.records : demoRecords(data);

  [["games", data.games], ["avg", data.avg], ["top4", data.top4], ["wins", data.wins]].forEach(pair => {
    const element = $('[data-metric="' + pair[0] + '"]');
    if (element) element.textContent = pair[1];
  });

  $("[data-comps]").innerHTML = data.comps.length ? data.comps.map(row =>
    '<div class="row"><strong>' + esc(row[0]) + '</strong><span class="muted">' + fmt(row[1]) + ' ' + copy[lang].games + '</span></div>'
  ).join("") : '<div class="muted">' + copy[lang].empty + '</div>';

  $("[data-units]").innerHTML = data.units.length ? data.units.map(row =>
    '<div class="row"><strong>' + esc(row[0]) + '</strong><span class="muted">' + fmt(row[1]) + ' ' + copy[lang].games + '</span></div>'
  ).join("") : '<div class="muted">—</div>';

  $("[data-augments]").innerHTML = data.augments.length ? data.augments.map(row =>
    '<div class="row"><strong>' + esc(row[0]) + '</strong><span class="muted">' + fmt(row[1]) + 'x · ' + copy[lang].average + ' ' + esc(row[2]) + '</span></div>'
  ).join("") : '<div class="muted">—</div>';

  $("[data-records]").innerHTML = records.map(row =>
    '<div class="row"><span class="muted">' + esc(row[0]) + '</span><strong>' + esc(row[1]) + '</strong></div>'
  ).join("");

  $("[data-placements]").innerHTML = data.placements.map((value, index) =>
    '<div class="place ' + (index < 4 ? "is-hot" : "") + '"><span>' + (index + 1) + 'º</span><small class="muted">' + fmt(value) + 'x</small></div>'
  ).join("");

  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.dataset.i18n;
    if (i18n[lang][key]) element.textContent = i18n[lang][key];
  });

  const langButton = $("[data-lang]");
  if (langButton) langButton.textContent = lang === "pt" ? "EN" : "PT-BR";
  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";

  document.querySelectorAll("[data-period]").forEach(button => {
    const active = button.dataset.period === period;
    button.classList.toggle("active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  const identity = $(".big-number");
  if (identity) identity.textContent = data.identity || "—";

  const identityText = $("[data-identity-text]");
  if (identityText) {
    identityText.textContent = source === "live"
      ? String(data.identity || "—") + " " + copy[lang].identitySuffix
      : (lang === "pt" ? "A demonstração mostra como a identidade do período será resumida." : "The demo shows how the period identity will be summarized.");
  }

  const summary = $("[data-feature-summary]");
  if (summary) {
    summary.innerHTML = '<strong class="good">Top 4 ' + esc(data.top4) + '</strong><div class="muted">' + fmt(data.games) + ' ' + copy[lang].games + (currentPlayer ? ' · ' + esc(currentPlayer.gameName + "#" + currentPlayer.tagLine) : "") + '</div>';
  }

  if (source === "live") setStatus(data.games ? "live" : "empty");
}

function updateUrl() {
  if (!currentLookup) return;
  const url = new URL(location.href);
  url.searchParams.set("riotId", currentLookup.gameName + "#" + currentLookup.tagLine);
  url.searchParams.set("server", currentLookup.platform);
  url.searchParams.set("period", period);
  url.searchParams.set("lang", lang);
  history.replaceState(null, "", url.pathname + "?" + url.searchParams.toString());
}

async function loadProfile(gameName, tagLine, platform) {
  const endpoint = window.TFT_WRAPPED_BACKEND && window.TFT_WRAPPED_BACKEND.tftProfile;
  if (!endpoint) {
    source = "demo";
    setStatus("error");
    render();
    return;
  }

  setStatus("loading");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 16000);

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameName, tagLine, platform }),
      signal: controller.signal
    });
    const data = await response.json().catch(() => ({}));
    const transport = data && data._transportError;
    const status = Number((transport && transport.status) || response.status || 0);
    const code = String((transport && transport.code) || data.error || "");

    if (!response.ok || data.error || transport) {
      source = "demo";
      if (status === 404 || code.indexOf("not_found") >= 0) setStatus("notFound");
      else if (status === 429 || code.indexOf("rate") >= 0) setStatus("rate");
      else setStatus("error");
      render();
      return;
    }

    liveMatches = Array.isArray(data.matches) ? data.matches : [];
    currentPlayer = data.player || { gameName, tagLine, platform: platform.toUpperCase() };
    currentLookup = { gameName, tagLine, platform };
    source = "live";
    updateUrl();
    render();
  } catch {
    source = "demo";
    setStatus("error");
    render();
  } finally {
    clearTimeout(timer);
  }
}

async function makeCardBlob() {
  const data = currentData || demo[period];
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 630;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#0b1020";
  ctx.fillRect(0, 0, 1200, 630);
  const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, "rgba(155,89,255,.38)");
  gradient.addColorStop(1, "rgba(29,214,190,.12)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 630);

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 54px system-ui";
  ctx.fillText("TFT Wrapped", 70, 90);
  ctx.font = "600 30px system-ui";
  ctx.fillStyle = "#d8dcef";
  ctx.fillText(currentPlayer ? currentPlayer.gameName + "#" + currentPlayer.tagLine : (lang === "pt" ? "Retrospectiva pessoal" : "Personal recap"), 70, 145);

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 78px system-ui";
  ctx.fillText(String(data.identity || "Flex"), 70, 260);
  ctx.font = "500 30px system-ui";
  ctx.fillStyle = "#d8dcef";
  ctx.fillText(String(data.games) + " " + copy[lang].games + " · Top 4 " + data.top4 + " · " + copy[lang].average + " " + data.avg, 70, 315);

  ctx.font = "600 28px system-ui";
  ctx.fillStyle = "#ffffff";
  ctx.fillText(lang === "pt" ? "Comps do periodo" : "Period comps", 70, 390);
  ctx.font = "500 25px system-ui";
  ctx.fillStyle = "#d8dcef";
  (data.comps || []).slice(0, 3).forEach((row, index) => {
    ctx.fillText(String(index + 1) + ". " + String(row[0]) + " · " + String(row[1]) + "x", 90, 440 + index * 42);
  });
  ctx.font = "500 20px system-ui";
  ctx.fillStyle = "#aeb5ce";
  ctx.fillText("helioconde.github.io/tft-personal-wrapped", 70, 590);

  return await new Promise(resolve => canvas.toBlob(resolve, "image/png"));
}

async function shareCard() {
  const blob = await makeCardBlob();
  if (!blob) return;
  const file = new File([blob], "tft-wrapped.png", { type: "image/png" });
  const shareData = { title: "TFT Wrapped", text: lang === "pt" ? "Meu TFT Wrapped" : "My TFT Wrapped", url: location.href, files: [file] };

  if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
    try {
      await navigator.share(shareData);
      return;
    } catch {}
  }

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "tft-wrapped.png";
  link.click();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  if (navigator.clipboard) navigator.clipboard.writeText(location.href).catch(() => {});
}

document.querySelectorAll("[data-period]").forEach(button => button.addEventListener("click", () => {
  period = button.dataset.period;
  updateUrl();
  render();
}));

$("[data-lang]").addEventListener("click", () => {
  lang = lang === "pt" ? "en" : "pt";
  localStorage.setItem("tft-wrapped-lang", lang);
  updateUrl();
  render();
});

$("[data-search]").addEventListener("submit", event => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const parsed = parseRiotId(form.get("riotId"));
  if (!parsed) {
    setStatus("invalid");
    return;
  }
  loadProfile(parsed.gameName, parsed.tagLine, String(form.get("region") || "br1").toLowerCase());
});

$("[data-share]").addEventListener("click", shareCard);

(function boot() {
  const params = new URLSearchParams(location.search);
  if (["week", "month", "set"].includes(params.get("period"))) period = params.get("period");
  if (params.get("lang") === "en") lang = "en";
  render();

  const parsed = parseRiotId(params.get("riotId"));
  const server = String(params.get("server") || "br1").toLowerCase();
  if (parsed) {
    const form = $("[data-search]");
    form.elements.riotId.value = parsed.gameName + "#" + parsed.tagLine;
    if ([...form.elements.region.options].some(option => option.value === server)) form.elements.region.value = server;
    loadProfile(parsed.gameName, parsed.tagLine, server);
  } else {
    setStatus("demo");
  }
})();
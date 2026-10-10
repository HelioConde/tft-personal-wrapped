"""Validate and install the original 20 WebP files from the supplied archive.

The importer never extracts arbitrary archive paths and rejects unexpected entries.
Run from the repository root.
"""
from pathlib import Path
from zipfile import ZipFile

ARCHIVE = Path("tft-wrapped-20-imagens-otimizadas.zip")
DESTINATION = Path("assets/tft-wrapped")
ICONS = (
    "crown", "swords", "shield", "star", "analytics",
    "share", "augment", "mascot", "lock", "search",
)
ILLUSTRATIONS = (
    "hero-cosmic-arena", "search-riot-id", "recent-matches",
    "share-wrapped", "favorite-comps", "augments-and-units",
    "placements-and-records", "mobile-wrapped", "privacy-archive",
    "demo-mode",
)
EXPECTED = {f"icons/{name}.webp" for name in ICONS} | {
    f"illustrations/{name}.webp" for name in ILLUSTRATIONS
}

if not ARCHIVE.is_file():
    raise SystemExit(f"Missing {ARCHIVE}: upload the 20-image ZIP to the repository root.")

with ZipFile(ARCHIVE) as archive:
    entries = [name for name in archive.namelist() if name.endswith(".webp")]
    if len(entries) != 20 or set(entries) != EXPECTED:
        missing = sorted(EXPECTED - set(entries))
        unexpected = sorted(set(entries) - EXPECTED)
        raise SystemExit(
            f"Expected 20 unique named WebP assets: missing={missing}; extra={unexpected}"
        )
    for name in sorted(EXPECTED):
        info = archive.getinfo(name)
        if info.file_size < 100 or info.file_size > 2_000_000:
            raise SystemExit(f"Invalid size for {name}: {info.file_size}")
        data = archive.read(info)
        if len(data) != info.file_size or data[:4] != b"RIFF" or data[8:12] != b"WEBP":
            raise SystemExit(f"Invalid WebP for {name}")
        output = DESTINATION / name
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_bytes(data)
        print(f"{output} ({len(data)} bytes)")

ARCHIVE.unlink()
print(f"Imported {len(EXPECTED)} WebP assets and removed the transfer ZIP.")

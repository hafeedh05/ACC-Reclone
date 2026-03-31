# Ad Command Center Media Manifest

This manifest defines the exact media system for the current frontend redesign. It is written for implementation, not concepting: each asset slot, motion slot, and swap rule is meant to keep the site visually coherent before final production media exists.

## Principles

- Treat media as a compositional system, not decoration.
- Prefer realistic browser and device framing over abstract UI illustration.
- Keep all media swappable without changing layout, spacing, or hierarchy.
- Use PNG for isolated cutouts and shells, JPG for photographic context, and transparent plates for compositional depth.
- Never hard-code a visual composition so tightly that better source art cannot replace it later.

## Naming Conventions

- Prefix all owned assets with `acc_`.
- Include page family, role, aspect ratio, and version.
- Use underscores for machine readability.
- Example: `acc_home_hero-browser-shell_1600x1200_v1.png`.

## Master Asset Inventory

| Filename | Size | Format | Primary Use | Art Direction |
| --- | --- | --- | --- | --- |
| `acc_home_hero-browser-shell_1600x1200_v1.png` | `1600 x 1200` | PNG, transparent | Homepage hero shell | A refined browser window with a soft graphite frame, visible chrome, and enough inset padding to hold asset trays and output previews |
| `acc_home_hero-product-bottle_2200x2800_v1.png` | `2200 x 2800` | PNG, transparent | Homepage hero and sample outputs | Premium skincare-style bottle with clear label space, warm lighting, and soft grounded shadow |
| `acc_home_hero-packaging-shot_2200x2200_v1.png` | `2200 x 2200` | PNG, transparent or neutral plate | Hero tray and output detail | Box or package photographed straight enough to remain legible in cropped cards |
| `acc_home_hero-hand-held-product_2400x3000_v1.png` | `2400 x 3000` | PNG, transparent preferred | Homepage and sample run support art | Hand-held product shot with natural grip, controlled highlight, and no overprocessing |
| `acc_home_hero-ad-thumbnail-9x16_1080x1920_v1.jpg` | `1080 x 1920` | JPG | Homepage 9:16 preview | Product-led ad frame with readable headline area and an obvious mobile-first crop |
| `acc_home_hero-ad-thumbnail-1x1_1600x1600_v1.jpg` | `1600 x 1600` | JPG | Homepage 1:1 preview | Square crop with centered subject, strong negative space, and clean brand balance |
| `acc_home_hero-ad-thumbnail-16x9_1920x1080_v1.jpg` | `1920 x 1080` | JPG | Homepage 16:9 preview | Landscape preview with a broader story beat and slower pacing feel |
| `acc_home_shadow-plate-xl_2600x1400_v1.png` | `2600 x 1400` | PNG, transparent | Homepage hero depth layer | Soft warm plate used under the browser scene to avoid flatness |
| `acc_home_shadow-plate-md_1800x1000_v1.png` | `1800 x 1000` | PNG, transparent | Gallery and proof surfaces | Lower-contrast plate for smaller compositions |
| `acc_run-cover_beauty_1800x2200_v1.jpg` | `1800 x 2200` | JPG | Sample run index and detail cover | Beauty launch frame with pack-shot clarity and premium restraint |
| `acc_run-cover_ecommerce_1800x2200_v1.jpg` | `1800 x 2200` | JPG | Sample run index and detail cover | Ecommerce launch frame with clean offer framing and texture |
| `acc_run-cover_apparel_1800x2200_v1.jpg` | `1800 x 2200` | JPG | Sample run index and detail cover | Apparel frame with editorial fit and motion potential |
| `acc_run-cover_tech-accessory_1800x2200_v1.jpg` | `1800 x 2200` | JPG | Sample run index and detail cover | Product-led accessory frame with disciplined utility language |
| `acc_run-storyboard-frame_1600x900_v1.jpg` | `1600 x 900` | JPG | Sample run detail storyboard strip | One clear scene frame with room for annotations and aspect tags |
| `acc_run-clip-preview_1600x900_v1.jpg` | `1600 x 900` | JPG | Sample run detail and command center preview | A believable motion still that can read as a clip placeholder without becoming fake UI |
| `acc_gallery-beauty_1600x2000_v1.jpg` | `1600 x 2000` | JPG | Gallery mosaic | Beauty proof tile with high-end product presence |
| `acc_gallery-ecommerce_1600x2000_v1.jpg` | `1600 x 2000` | JPG | Gallery mosaic | Ecommerce proof tile with stronger offer framing |
| `acc_gallery-apparel_1600x2000_v1.jpg` | `1600 x 2000` | JPG | Gallery mosaic | Apparel tile with editorial spacing and fabric clarity |
| `acc_gallery-product_1600x2000_v1.jpg` | `1600 x 2000` | JPG | Gallery mosaic | General product tile that can support supplement or accessory content |
| `acc_journal-hero_2400x1350_v1.jpg` | `2400 x 1350` | JPG | Journal article hero | Editorial cover image with a quiet, premium production tone |
| `acc_case-study-hero_2400x1350_v1.jpg` | `2400 x 1350` | JPG | Case study detail hero | Hero image that looks like a real campaign outcome rather than a concept board |
| `acc_author-portrait_800x800_v1.png` | `800 x 800` | PNG, transparent or neutral | Journal and case study bylines | Minimal portrait treatment with no visual clutter |
| `acc_app-asset-thumbnail_800x800_v1.png` | `800 x 800` | PNG, transparent preferred | Dashboard and project asset trays | Repeatable asset tile system for uploads |
| `acc_app-browser-shell_2400x1600_v1.png` | `2400 x 1600` | PNG, transparent | Command center and app preview | Large browser shell for teaser sections and product screenshots |
| `acc_app-preview-9x16_1080x1920_v1.png` | `1080 x 1920` | PNG or JPG | Outputs library and sample-run preview | Vertical output frame with mobile-first hierarchy |
| `acc_app-preview-1x1_1600x1600_v1.png` | `1600 x 1600` | PNG or JPG | Outputs library and sample-run preview | Square output frame with balanced composition |
| `acc_app-preview-16x9_1920x1080_v1.png` | `1920 x 1080` | PNG or JPG | Outputs library and sample-run preview | Landscape output frame with broader narrative room |

## Page Placements

### Homepage

- Use `acc_home_hero-browser-shell_1600x1200_v1.png` as the main editorial frame.
- Place `acc_home_hero-product-bottle_2200x2800_v1.png`, `acc_home_hero-packaging-shot_2200x2200_v1.png`, and `acc_home_hero-hand-held-product_2400x3000_v1.png` inside the left-side asset tray.
- Place `acc_home_hero-ad-thumbnail-9x16_1080x1920_v1.jpg`, `acc_home_hero-ad-thumbnail-1x1_1600x1600_v1.jpg`, and `acc_home_hero-ad-thumbnail-16x9_1920x1080_v1.jpg` inside the output column.
- Back the whole composition with `acc_home_shadow-plate-xl_2600x1400_v1.png`.

### How It Works

- Reuse the homepage browser shell family for continuity.
- Use `acc_run-storyboard-frame_1600x900_v1.jpg` for each step visual anchor.
- Keep the step visuals as a single shell that changes content, not eight unrelated illustrations.

### Sample Runs

- Use the four cover images as the archive entry points.
- Use `acc_run-storyboard-frame_1600x900_v1.jpg` in the detail timeline and annotation rail.
- Use `acc_run-clip-preview_1600x900_v1.jpg` for clip generation and final assembly states.

### Gallery

- Use the four mosaic images as the primary proof grid.
- Favor crop-tight image treatment with a thin caption rail.
- Let one image per row or tile feel dominant; do not force equal visual weight.

### Journal

- Use `acc_journal-hero_2400x1350_v1.jpg` on article detail pages.
- Use `acc_author-portrait_800x800_v1.png` for bylines and contributor cards only.

### Case Studies

- Use `acc_case-study-hero_2400x1350_v1.jpg` as the hero art for each detail page.
- Reuse output and storyboard stills inside outcome sections if a case study needs visual proof.

### App Shell

- Use `acc_app-asset-thumbnail_800x800_v1.png` for upload trays and asset ledgers.
- Use `acc_app-browser-shell_2400x1600_v1.png` for dashboard and command-center teaser previews.
- Use `acc_app-preview-9x16_1080x1920_v1.png`, `acc_app-preview-1x1_1600x1600_v1.png`, and `acc_app-preview-16x9_1920x1080_v1.png` in the outputs library.

## Motion Slots

| Slot | Trigger | Asset | Behavior |
| --- | --- | --- | --- |
| `hero-parallax` | Hover and slight pointer movement | Homepage browser shell and output stack | Move nested media layers `6-10px` at most; do not shift the page chrome |
| `workflow-sticky-step` | Scroll | How It Works step visuals | Swap active visual emphasis as each narrative step becomes current |
| `sample-run-scrubber` | Drag or step click | Sample run detail timeline | Progress the timeline and preview frame with calm, discrete movement |
| `gallery-hover-zoom` | Hover | Gallery proof tiles | Scale up to `1.015` max with caption reveal |
| `command-center-ticker` | Timer or live update | Command center feed | Fade new rows in with a short upward settle |
| `output-variant-focus` | Hover or keyboard focus | Outputs library tiles | Reveal publish/share actions and a more pronounced caption rail |
| `article-toc-stick` | Scroll | Journal article template | Keep the TOC visible without animating it aggressively |

## PNG Cutout Needs

Use PNG cutouts only where the object needs to float above a tonal plate.

- `product bottle cutout`
  - transparent PNG
  - clean outline, subtle drop shadow, label readable at `180px` width minimum
- `phone mockup`
  - transparent PNG
  - no bezel clutter, no fake notification spam
- `laptop/browser mockup`
  - transparent PNG
  - browser chrome must feel real, not illustration-like
- `packaging shot`
  - PNG preferred when background separation matters
  - JPG acceptable when the shot lives inside a full-bleed editorial panel
- `hand-held product image`
  - transparent PNG preferred for hero systems
  - keep hands natural, no exaggerated grip
- `ad thumbnail crop`
  - JPG or PNG
  - use as the key proof image in `9:16`, `1:1`, and `16:9`
- `transparent shadow plate`
  - PNG, low opacity
  - always swappable, always below the asset layer

## Shadow Plate Rules

- Every hero composition gets one grounding plate.
- Use a wide soft plate for large browser compositions and a tighter plate for product grids.
- Shadow plates must never be the primary visual object.
- If the replacement asset already has a strong natural shadow, reduce plate opacity rather than stacking both aggressively.

## Swap Rules

- Keep each asset in a dedicated media frame with consistent inner padding.
- Never mask a product into a unique one-off shape if a standard ratio frame will do.
- Keep the source composition centered enough that future replacements do not shift headline, caption, or CTA alignment.
- Preserve output ratios across swaps:
  - `9:16` for performance and mobile-first previews
  - `1:1` for brand and archive tiles
  - `16:9` for feature and case-study layouts
- When a final asset arrives, replace the placeholder in place and keep the container, shadow plate, and caption rail unchanged.

## Missing Asset Priority

If only a small asset budget is available, replace in this order:

1. Homepage hero browser shell
2. Homepage `9:16` output preview
3. Homepage product cutout
4. Sample run cover images
5. Journal and case-study hero images
6. Gallery mosaic images
7. App preview frames

This keeps the marketing site feeling real first, then upgrades the proof surfaces, then the app teasers.

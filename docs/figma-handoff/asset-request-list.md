# Ad Command Center Asset Request List

All art must be realistic, high-resolution, and swappable without redesigning the composition. Do not use low-quality generated art, fantasy imagery, mascots, or fake dashboards.

## Required Placeholder Labels

If the final asset is missing, create a framed placeholder in Figma with one of these exact labels:

- `product bottle cutout`
- `phone mockup`
- `laptop/browser mockup`
- `packaging shot`
- `hand-held product image`
- `ad thumbnail crop`
- `transparent shadow plate`

## Asset Standards

- Preferred format for isolated product or device art: `PNG`
- Preferred format for contextual photography: `JPG` or `PNG`
- Color treatment:
  - neutral-to-warm lighting
  - realistic shadows
  - no surreal grading
- Cropping:
  - leave breathing room around hero assets
  - preserve packaging and label readability

## Asset Manifest

### Homepage Hero

- `hero_laptop-browser-mockup_v1.png`
  - size: `3200 x 2200`
  - background: transparent
  - usage: main hero mockup shell
- `hero_product-bottle-cutout_v1.png`
  - size: `2200 x 2800`
  - background: transparent
  - usage: beauty/ecommerce hero art
- `hero_packaging-shot_v1.png`
  - size: `2200 x 2200`
  - background: transparent or clean neutral plate
  - usage: secondary hero asset tray
- `hero_hand-held-product-image_v1.png`
  - size: `2400 x 3000`
  - background: transparent preferred
  - usage: sample preview swap
- `hero_ad-thumbnail-crop_01.png`
  - size: `1200 x 1800`
  - background: opaque
  - usage: `9:16` output preview
- `hero_ad-thumbnail-crop_02.png`
  - size: `1600 x 1600`
  - background: opaque
  - usage: `1:1` output preview
- `hero_ad-thumbnail-crop_03.png`
  - size: `1920 x 1080`
  - background: opaque
  - usage: `16:9` output preview
- `hero_transparent-shadow-plate_xl.png`
  - size: `2600 x 1400`
  - background: transparent
  - usage: underlay for hero media grouping

### Sample Runs

- `sample-run_beauty_cover_v1.png`
  - size: `1800 x 2200`
  - usage: beauty run index tile
- `sample-run_ecommerce_cover_v1.png`
  - size: `1800 x 2200`
  - usage: ecommerce run index tile
- `sample-run_apparel_cover_v1.png`
  - size: `1800 x 2200`
  - usage: apparel run index tile
- `sample-run_tech-accessory_cover_v1.png`
  - size: `1800 x 2200`
  - usage: tech accessory or supplement concept tile
- `sample-run_storyboard-frame_01.png`
  - size: `1600 x 900`
  - usage: storyboard contextual frame
- `sample-run_clip-preview_01.png`
  - size: `1600 x 900`
  - usage: clip stage preview

### Gallery

- `gallery_beauty_01.png`
  - size: `1600 x 2000`
- `gallery_ecommerce_01.png`
  - size: `1600 x 2000`
- `gallery_apparel_01.png`
  - size: `1600 x 2000`
- `gallery_product_01.png`
  - size: `1600 x 2000`

### Journal and Case Studies

- `journal_article-hero_01.jpg`
  - size: `2400 x 1350`
  - usage: journal hero image
- `case-study_hero_01.jpg`
  - size: `2400 x 1350`
  - usage: case study hero
- `author_portrait_01.png`
  - size: `800 x 800`
  - background: transparent or neutral

### App Surfaces

- `app_asset-thumbnail_01.png`
  - size: `800 x 800`
  - usage: asset tray
- `app_asset-thumbnail_02.png`
  - size: `800 x 800`
  - usage: asset tray
- `app_preview_frame_16x9_01.png`
  - size: `1600 x 900`
  - usage: command center active preview
- `app_preview_frame_9x16_01.png`
  - size: `1080 x 1920`
  - usage: outputs library preview
- `app_browser-shell_01.png`
  - size: `2400 x 1600`
  - background: transparent
  - usage: laptop/browser frame overlay

## Swap Rules

- Every art slot lives inside a reusable media frame component
- Do not hard-mask assets directly into unique one-off shapes
- Use shadow plates and tonal backdrops so higher-quality replacements can drop in later
- Keep all export previews in a predictable ratio family:
  - portrait: `9:16`
  - square: `1:1`
  - landscape: `16:9`

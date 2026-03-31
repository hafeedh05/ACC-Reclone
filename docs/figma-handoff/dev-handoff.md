# Ad Command Center Dev Handoff

This page translates the design package into implementation rules for the existing codebase.

## Token Naming

Mirror Figma variables to CSS variables with the same hierarchy:

- `color.bg.canvas`
- `color.bg.surface`
- `color.text.primary`
- `color.text.secondary`
- `color.border.subtle`
- `color.accent.amberBase`
- `space.6`
- `radius.xl`
- `shadow.medium`
- `layout.container.default`
- `motion.duration.base`

Suggested CSS mapping:

- `--color-bg-canvas`
- `--color-bg-surface`
- `--color-text-primary`
- `--color-border-subtle`
- `--space-6`
- `--radius-xl`
- `--shadow-medium`

## Component Inventory

Core components to build and document:

- site header
- mobile nav drawer
- primary button
- secondary button
- text link
- chip
- filter chip
- input field
- textarea field
- select field
- upload module
- section header
- trust/logo strip
- browser frame
- laptop/device frame
- image thumbnail
- sample output tile
- progress rail
- event feed row
- role status row
- approval panel
- output variant row
- article hero
- article body blocks
- case-study stat block
- footer

## Responsive Rules

- Desktop uses asymmetry and sticky rails whenever it improves storytelling
- Tablet collapses three-column product layouts into `media -> status -> utilities`
- Mobile prioritizes preview first, then context, then controls
- Avoid desktop-only decorative frames that become dead weight on mobile
- Keep filter controls horizontally scrollable on mobile instead of wrapping into multi-line clutter

## Hover, Focus, and Active States

- Buttons:
  - hover: lift `1-2px`, brightness increase, subtle border clarity
  - active: reduce lift, deepen plate tone
  - focus: amber focus ring token only
- Media tiles:
  - hover: `1.015` scale max, metadata reveal, no dramatic tilt
- Filter chips:
  - active state uses tonal fill plus sharp text contrast
- Command center rows:
  - hover: row illumination only, never glowing neon

## Motion Notes

- Hero hover parallax:
  - asset layer moves `6-10px`
  - CTA group moves `2-4px`
- Scroll reveal:
  - opacity from `0 -> 1`
  - translateY from `16 -> 0`
  - stagger between siblings: `40-60ms`
- Sticky workflow progression:
  - progress rail fills steadily as narrative steps advance
- Output hover zoom:
  - cap at `1.015` scale
- Sample-run scrubber:
  - horizontal drag or step navigation
- Command-center event ticker:
  - one new row enters at a time
  - opacity fade plus `8px` upward settle
- Approval/regenerate interactions:
  - keep state changes immediate and calm

## Page-by-Page Implementation Notes

### Homepage

- Build hero as a composed editorial section, not a centered marketing block
- Use one realistic browser/device scene as the anchor
- Trust band must remain clean and low-noise
- Sample outputs should be thumbnail-first with editorial captions

### How It Works

- Implement sticky storytelling using CSS `position: sticky` and progressive section activation
- Reuse the same core visual shell instead of designing eight disconnected illustrations

### Sample Runs

- Index needs server-friendly SEO structure
- Detail template should be content-model-driven so each run can render a brief, asset set, progress feed, and outputs

### Gallery

- Prefer masonry-like rhythm without fully unpredictable heights
- Hover overlays must remain legible on dark imagery and warm product tones

### Pricing and Enterprise

- Use narrative sections, not dense pricing matrices
- Enterprise page should convert through clarity, not feature overload

### Journal and Case Studies

- Build typography primitives first
- Related content and inline CTAs should be componentized and reusable

### Dashboard

- Recent projects should behave like compact, sortable data views with strong visual polish
- Saved templates remain utility modules, not decorative promos

### Project Detail

- Keep approvals and outputs discoverable above the fold on desktop
- Asset tray should support mixed ratios without collapsing the layout

### Command Center

- Left rail width target: `280-320px`
- Right rail width target: `320-360px`
- Center column owns preview, stage rail, and storyboard context
- Preserve real operational labels under the theatrical role language
- Retry, fallback, and review states should be visible but understated

### Outputs Library

- Grid/list toggle must preserve sorting and filters
- Actions stay at row or tile edge, not in cluttered toolbars

## What Must Be Coded Later

- Real auth
- real upload handling and signed URLs
- real provider adapters
- live SSE or WebSocket event flow from the backend
- persistence for projects, runs, assets, approvals, and outputs
- publish/download/share integrations

## Media Manifest

Use [../media-manifest.md](../media-manifest.md) as the exact asset and motion inventory for the redesigned frontend. It is the source of truth for filenames, ratios, pixel dimensions, page placements, motion slots, PNG cutouts, shadow plates, and swap rules.

## What Is Purely Visual

- hero mockup composition
- editorial spacing rhythm
- tonal plates and shadow treatments
- animation timing and reveal choreography
- placeholder framing and image slot behavior

## SEO Page Map

Primary conversion surfaces:

- homepage
- how it works
- sample runs
- pricing
- enterprise

SEO depth surfaces:

- journal index
- journal articles
- case studies index
- case study detail
- sample-run detail pages
- future industry/use-case pages

## Copy Map

Use [copy-deck.md](./copy-deck.md) as the text source for:

- homepage hierarchy
- page intros
- nav labels
- CTA labels
- app shell section labels
- command center stage language

## Open Questions

- final logo lockup and wordmark treatment are not defined yet
- verified trust logos are not provided yet
- product photography library is not provided yet
- journal editorial voice needs owner review before scaling content templates
- enterprise contact flow needs final CRM or form destination

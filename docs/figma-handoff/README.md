# Ad Command Center Figma Handoff

This package is the Figma-first source of truth for the next design pass of Ad Command Center.

Direct Figma MCP access is available in this session, but the exposed toolset is better suited for reading Figma, generating diagrams, and importing pages than for composing a full multi-page product design from scratch. Because of that, this package is structured so a designer can build the file immediately in Figma with no guesswork, while engineering can map it cleanly into the current Next.js and Rust stack later.

## Design Intent

- Premium, restrained, editorial, product-led
- Dark-mode-first with graphite, charcoal, off-white, warm amber, and muted cobalt
- Realistic browser and device framing
- Image-led composition with tonal surfaces and deliberate whitespace
- No fake charts, no sci-fi glass dashboards, no robots, no provider mentions
- Homepage stays concise; SEO depth moves into journal, case studies, industry pages, and sample-run pages

## Reference Direction

These references inform composition and product tone, not literal visuals:

- `https://runwayml.com/`
  - cinematic scale, strong hero confidence, large media framing
- `https://lumalabs.ai/dream-machine`
  - uninterrupted workflow storytelling, focused step narration
- `https://www.krea.ai/`
  - clear creative-tool utility, asset-first browsing surfaces
- `https://www.aesop.com/`
  - restrained editorial rhythm, premium product pacing, quiet confidence

## Figma File Structure

### `00_Cover`

- `Cover / Desktop 1600`
- One-line thesis: `Turn a brief into campaign-ready ads`
- Poster-style browser/device mockup with warm amber accent edge

### `01_Moodboard_References`

- `Moodboard / Creative tools`
- `Moodboard / Editorial product sites`
- `Moodboard / Motion and framing cues`
- Each reference tile includes:
  - screenshot slot
  - observed trait
  - what to borrow
  - what to avoid

### `02_Foundations`

- `Foundations / Color`
- `Foundations / Type`
- `Foundations / Spacing and radius`
- `Foundations / Shadows and dividers`
- `Foundations / Layout and containers`
- `Foundations / Motion`
- `Foundations / Media framing`

Use variables for:

- color
- typography
- spacing
- radius
- shadow
- layout
- motion
- icon sizing
- media framing

### `03_Components`

- `Header / Desktop`
- `Header / Mobile`
- `Buttons / All states`
- `Links / Inline and nav`
- `Pills and chips`
- `Fields / Input, textarea, select`
- `Upload modules / Empty, uploading, complete, error`
- `Tabs and filter chips`
- `Section headers`
- `Trust/logo strip`
- `Browser frame`
- `Laptop/device frame`
- `Image thumbnail`
- `Sample output tile`
- `Timeline/progress rail`
- `Event feed row`
- `Role status row`
- `Approval panel`
- `Output variant row`
- `Article blocks`
- `Case-study stat treatment`
- `Footer`

### `04_Marketing_Home`

- `Home / Desktop 1440`
- `Home / Tablet 1024`
- `Home / Mobile 390`
- `Home / Hero hover states`
- `Home / Output hover states`

### `05_How_It_Works`

- `How It Works / Desktop 1440`
- `How It Works / Tablet 1024`
- `How It Works / Mobile 390`
- `How It Works / Sticky progression notes`

### `06_Sample_Runs`

- `Sample Runs / Index Desktop`
- `Sample Runs / Index Mobile`
- `Sample Run / Detail Desktop`
- `Sample Run / Detail Mobile`
- `Sample Run / Scrubber states`

### `07_Gallery`

- `Gallery / Desktop`
- `Gallery / Mobile`
- `Gallery / Filter states`
- `Gallery / Hover states`

### `08_Pricing_Enterprise`

- `Pricing / Desktop`
- `Pricing / Mobile`
- `Enterprise / Desktop`
- `Enterprise / Mobile`

### `09_Journal_Case_Study_Templates`

- `Journal / Index`
- `Journal / Article Desktop`
- `Journal / Article Mobile`
- `Case Studies / Index`
- `Case Study / Detail Desktop`
- `Case Study / Detail Mobile`

### `10_App_Shell`

- `Dashboard / Desktop`
- `Dashboard / Tablet`
- `Dashboard / Mobile`
- `Shell / Navigation states`

### `11_Project_Detail`

- `Project Detail / Desktop`
- `Project Detail / Tablet`
- `Project Detail / Mobile`

### `12_Command_Center`

- `Command Center / Desktop`
- `Command Center / Tablet`
- `Command Center / Mobile`
- `Command Center / Live states`
- `Command Center / Approval and retry states`

### `13_Outputs_Library`

- `Outputs / Grid Desktop`
- `Outputs / List Desktop`
- `Outputs / Mobile`
- `Outputs / Hover and action states`

### `14_Prototype_Flows`

- `Flow A / Marketing exploration`
- `Flow B / Sample run evaluation`
- `Flow C / Enterprise inquiry`
- `Flow D / Create project`
- `Flow E / Review and approve`
- `Flow F / Command center live run`
- `Flow G / Export and publish`

### `15_Dev_Handoff`

- `Tokens map`
- `Component inventory`
- `Responsive rules`
- `Motion rules`
- `Asset manifest`
- `SEO page map`
- `Copy map`
- `Implementation notes`
- `Open questions`

## Layout System

### Desktop

- 12-column grid
- `max-width`: `1440`
- gutter: `24`
- outside margin: `32`
- default section top/bottom spacing: `104`
- content rhythm anchored to large editorial blocks, not repeated card grids

### Tablet

- 8-column grid
- `max-width`: `1024`
- gutter: `20`
- outside margin: `24`
- hero shifts to stacked composition with media first, supporting copy second

### Mobile

- 4-column grid
- `max-width`: `390`
- gutter: `16`
- outside margin: `16`
- vertical rhythm is controlled by image cadence and copy grouping, not visible boxes

## Core Surface Definitions

### Marketing Home

Use a left-to-right editorial hero:

- left: headline, subhead, two CTAs, brief chips
- right: realistic laptop/browser mockup with split composition
- inside mockup left:
  - uploaded asset thumbnails
  - brief chips
  - offer summary
- inside mockup right:
  - `9:16`, `1:1`, `16:9` outputs
  - polished preview frames

Follow with:

- trust band
- sample outputs
- three-step workflow
- command center teaser
- case study teaser
- pricing teaser
- enterprise CTA
- footer

### How It Works

Build as a sticky narrative:

- left on desktop: anchored visual rail or single hero visual that updates
- right on desktop: step copy blocks
- active step controls visible progress on the visual rail
- no oversized infographic treatment

### Sample Runs

Index page:

- quiet filter row
- large visual tiles
- concise metadata
- concept summary

Detail page:

- brief snapshot
- asset selection
- stage-by-stage progress
- concept summary
- output gallery

### Gallery

- image-led, dense enough to feel alive but not noisy
- filter chips for industry, aspect ratio, and campaign type
- hover reveals title, cut type, and aspect without turning into a dashboard

### Pricing and Enterprise

- pricing remains concise and narrative
- enterprise page leans into governance, review control, templates, team workflows, and scale
- avoid giant comparison tables

### Journal and Case Studies

- readable text column around `720` to `760`
- sticky table of contents on desktop
- muted metadata
- inline CTA modules every two to three scroll sections

### Dashboard

- premium compact overview
- recent projects are arranged as a ranked list rather than a heavy card grid
- saved templates appear as utility modules
- status filters stay persistent but visually quiet

### Project Detail

- brief summary and asset tray at top
- goals, formats, and approvals grouped into a narrow right-hand utility rail on desktop
- latest outputs visible without leaving the page

### Command Center

Flagship composition:

- left rail:
  - brief summary
  - asset tray
  - requested output formats
- center:
  - stage timeline
  - active preview
  - storyboard or clip context
- right rail:
  - live event feed
  - role status list
  - retry/fallback notices

Tone:

- alive but calm
- premium and believable
- theatrical copy only in small doses
- operational truth always visible

### Outputs Library

- grid/list toggle
- variant rows for `Performance Cut`, `Brand Cut`, `Feature Cut`, `Platform Cut`
- visible export badges for `9:16`, `1:1`, `16:9`
- restrained row actions: publish, download, share

## Deliverables in This Package

- [Design tokens](./design-tokens.json)
- [Copy deck](./copy-deck.md)
- [Asset request list](./asset-request-list.md)
- [Dev handoff](./dev-handoff.md)

## Screen Inventory

Marketing screens:

- Homepage
- How It Works
- Sample Runs index
- Sample Run detail
- Gallery
- Pricing
- Enterprise
- Journal index
- Journal article template
- Case studies index
- Case study template

Authenticated product screens:

- Dashboard
- Project detail
- Command Center
- Outputs library

## Prototype Flows

- Flow A: Homepage -> How It Works -> Sample Runs -> Sample Run detail
- Flow B: Homepage -> Pricing -> Enterprise contact CTA
- Flow C: Homepage -> Journal index -> Journal article -> Sample Runs
- Flow D: Dashboard -> New project -> Project detail
- Flow E: Project detail -> Script review -> Storyboard approval -> Command Center
- Flow F: Command Center -> Outputs library -> Publish/download/share

FigJam references created for this package:

- Prototype map: `https://www.figma.com/online-whiteboard/create-diagram/6c1c828d-dccd-4e81-a251-e0cb506ea63b?utm_source=other&utm_content=edit_in_figjam&oai_id=&request_id=7ea37486-0ef0-4d06-9825-491682833035`
- Command center flow: `https://www.figma.com/online-whiteboard/create-diagram/99796d89-07b7-4a68-b892-696ac44e01da?utm_source=other&utm_content=edit_in_figjam&oai_id=&request_id=85b19a2f-cb7c-4846-8684-4858a7458b9a`

## Non-Negotiable Visual Rules

- Do not default to outlined card stacks for every section
- Use tonal planes, spacing, alignment, image scale, and typography to create structure
- Every art area must accept a higher-quality replacement asset later without redesign
- All placeholders must state exactly what asset is needed
- Motion should feel quiet and expensive, never flashy

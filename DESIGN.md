---
name: pixel3d-ui
description: Die-cut laptop stickers turned into a pixel-art, 3D component library for hackathons.
colors:
  pink: "#ff3d8b"
  lime: "#b6f23a"
  sky: "#36b8ff"
  tomato: "#ff5a36"
  butter: "#ffd23f"
  ink: "#141414"
  ink-soft: "#4a4d55"
  placeholder: "#62656c"
  paper: "#ffffff"
  disabled-face: "#e4e6ea"
  lid-silver: "#cdd1d8"
  lid-silver-deep: "#bfc4cc"
  on-lid: "#141414"
  on-lid-soft: "#3e4148"
  lid-space: "#2b2e35"
  lid-space-deep: "#23262c"
  on-lid-dark: "#f2f3f5"
  on-lid-soft-dark: "#b9bdc6"
typography:
  display:
    fontFamily: "Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "6rem"
    fontWeight: 800
    lineHeight: 0.95
    letterSpacing: "-0.03em"
    fontVariation: "'opsz' 96"
  headline-lg:
    fontFamily: "Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "4rem"
    fontWeight: 800
    lineHeight: 1.02
    letterSpacing: "-0.025em"
  headline-md:
    fontFamily: "Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 800
    lineHeight: 1.08
    letterSpacing: "-0.02em"
  title-lg:
    fontFamily: "Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2rem"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.01em"
  title-md:
    fontFamily: "Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.375
  lead:
    fontFamily: "Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 500
    lineHeight: 1.45
  body:
    fontFamily: "Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 500
    lineHeight: 1.55
  body-sm:
    fontFamily: "Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 500
    lineHeight: 1.55
  control:
    fontFamily: "Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 800
    letterSpacing: "-0.01em"
  label:
    fontFamily: "Bricolage Grotesque Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 800
    lineHeight: 1
  mono:
    fontFamily: "ui-monospace, Cascadia Code, SF Mono, Menlo, monospace"
    fontSize: "0.9em"
rounded:
  none: "0px"
spacing:
  u1: "4px"
  u2: "8px"
  u3: "12px"
  u4: "16px"
  u5: "20px"
  u6: "24px"
  u7: "28px"
  u8: "32px"
components:
  button-primary:
    backgroundColor: "{colors.pink}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    rounded: "{rounded.none}"
    padding: "0 20px"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    padding: "0 20px"
    height: "48px"
  button-success:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    padding: "0 20px"
    height: "48px"
  button-destructive:
    backgroundColor: "{colors.tomato}"
    textColor: "{colors.ink}"
    typography: "{typography.control}"
    padding: "0 20px"
    height: "48px"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.control}"
    padding: "0 20px"
    height: "48px"
  button-ghost:
    textColor: "{colors.on-lid}"
    typography: "{typography.control}"
    padding: "0 20px"
    height: "48px"
  button-sm:
    padding: "0 16px"
    height: "40px"
  button-lg:
    padding: "0 28px"
    height: "56px"
  button-icon:
    size: "48px"
  button-disabled:
    backgroundColor: "{colors.disabled-face}"
    textColor: "{colors.ink-soft}"
  badge:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "0 12px"
    height: "32px"
  badge-track:
    backgroundColor: "{colors.sky}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "0 12px"
    height: "32px"
  card:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "28px"
  input-band:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.body-sm}"
    padding: "8px"
  input-band-focus:
    backgroundColor: "{colors.sky}"
    textColor: "{colors.ink}"
  input-band-invalid:
    backgroundColor: "{colors.tomato}"
    textColor: "{colors.ink}"
  input-panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    padding: "0 12px"
    height: "48px"
  input-disabled:
    backgroundColor: "{colors.disabled-face}"
    textColor: "{colors.ink-soft}"
  checkbox:
    backgroundColor: "{colors.paper}"
    size: "36px"
  checkbox-checked:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
    size: "36px"
  switch:
    backgroundColor: "{colors.paper}"
    width: "76px"
    height: "40px"
  switch-on:
    backgroundColor: "{colors.sky}"
  switch-knob:
    backgroundColor: "{colors.ink}"
    size: "26px"
  tabs-trigger:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "0 16px"
    height: "44px"
  tabs-trigger-active:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
  menu:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    padding: "8px"
    width: "224px"
  menu-item-highlight:
    backgroundColor: "{colors.pink}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    padding: "0 12px"
    height: "40px"
  menu-item-destructive-highlight:
    backgroundColor: "{colors.tomato}"
    textColor: "{colors.ink}"
  command-item-highlight:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    padding: "0 12px"
    height: "44px"
  sidebar-item-active:
    backgroundColor: "{colors.pink}"
    textColor: "{colors.ink}"
  toast:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
  toast-success:
    backgroundColor: "{colors.lime}"
  toast-error:
    backgroundColor: "{colors.tomato}"
  alert-info:
    backgroundColor: "{colors.sky}"
    textColor: "{colors.ink}"
  alert-warning:
    backgroundColor: "{colors.butter}"
    textColor: "{colors.ink}"
  field-error:
    backgroundColor: "{colors.tomato}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    padding: "6px 12px"
  kbd:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.label}"
    padding: "0 8px 4px"
    height: "32px"
  leaderboard-row:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    height: "64px"
  rank-leader:
    backgroundColor: "{colors.lime}"
    textColor: "{colors.ink}"
    size: "48px"
  rank-podium:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    size: "48px"
  rank-rest:
    backgroundColor: "{colors.lid-silver-deep}"
    textColor: "{colors.on-lid}"
    size: "48px"
---

# Design System: pixel3d-ui

## Overview

**Creative North Star: "The Sticker Sheet"**

Every component is a **die-cut laptop sticker**:
- a pixel-stepped silhouette inside a white kiss-cut border
- stuck onto a laptop-lid aluminium ground
- a little crooked at rest, peeling up when hovered and slapping down when pressed

The world comes from the sticker-covered laptops at every hackathon table. It's fun and quirky because of how things *behave* when touched, not because of decoration piled on top.

The balance this system holds:
- **Fun, not noisy:** the motion and the material carry the personality. The layout stays calm.
- **Pixel as seasoning, not wallpaper:** pixel art lives in silhouettes, icons and 3D voxel stickers. Text is always set in a readable typeface.
- **3D is physical:** CSS 3D for everyday peel and slap, plus one shared three.js canvas for showpiece moments.

The material is one CSS utility. A sticker is an element whose face is painted by a `::before` block plus four stepped box-shadow bands, wrapped in four stacked 4px white drop-shadows (the kiss-cut) and one soft lip shadow. Face color, cut color and shadow are all custom properties (`--face`, `--p3d-cut`, `--p3d-sh`), so state changes are property swaps, not new components.

**The Sticker Rule.** If it can't be described as "a sticker doing something", it doesn't belong in this system.

**The Seasoning Rule.** Pixel art never sets body text and never fills a background. It shapes edges, icons and voxels.

**Key Characteristics:**
- Pixel-stepped silhouettes on a 4px grid; no smooth radius exists (the radius scale is erased).
- A 4px white kiss-cut border around every sticker, in both themes; it turns sky on keyboard focus.
- Five vinyl inks with one job each, always carrying Ink text.
- Deterministic resting tilt on small standalone stickers; fields, tables and menus stay straight.
- Peel on hover, slap on press, land on commit, all on one spring.
- One shared three.js canvas for voxel showpieces; dense controls are pure CSS.

## Colors

Five vinyl inks on a neutral aluminium lid. Each ink has exactly one job and never decorates. The theme changes only the lid: sticker faces, inks and the white kiss-cut border stay the same in light and dark, just like real stickers on a silver or a space-gray laptop. Dark mode is a `.dark` class on an ancestor.

### Primary
- **Hot Pink** (`pink`): the action ink. Primary buttons, the main call to action, the text caret and text selection, the highlighted item in an action menu, the current step in a stepper, and the active page marker in the sidebar and breadcrumb. One primary pink sticker per view region.

### Secondary
- **Lime** (`lime`): chosen and success. Selected tabs, toggles and radio cards, the active navigation-menu item, the highlighted item in a list or command palette, a checked checkbox, success toasts, completed steps, and the rank-1 sticker on a leaderboard.
- **Sky** (`sky`): on, focus and info. Switch-on tracks, the focused field band, the kiss-cut and outline on keyboard focus, info alerts and toasts, the dropzone while a file hovers, and category or track badges (a track is information, not an action).

### Tertiary (semantic only, used rarely)
- **Tomato** (`tomato`): destructive and error. Destructive buttons and menu items, the invalid field band, field-error stickers, error toasts.
- **Butter** (`butter`): warning. Warning alerts and toasts.

### Neutral
- **Sticker White** (`paper`): the default sticker face and the kiss-cut border, in both themes.
- **Ink** (`ink`): all text and pixel icons on sticker faces, structural lines, the switch knob, the scrollbar thumb, and the resting field band.
- **Ink Soft** (`ink-soft`): secondary text and field icons on white faces (8.4:1), and disabled sticker text.
- **Hint Gray** (`placeholder`): field placeholder text only (5.8:1 on paper: AA, still reads as a hint).
- **Blank Vinyl** (`disabled-face`): the face of every disabled sticker, and empty leaderboard score blocks.
- **Lid Silver** (`lid-silver`): the light-theme ground. **Lid Silver Deep** (`lid-silver-deep`) marks recessed regions (sidebar, skeletons, scrollbar track, the key-cap lip, leaderboard ranks 4 and below). Text directly on the light lid is `on-lid`; secondary text there is `on-lid-soft` (6.7:1).
- **Lid Space** (`lid-space`): the dark-theme ground. **Lid Space Deep** (`lid-space-deep`) marks recessed regions. Text sitting directly on the dark lid uses `on-lid-dark` (12.2:1); secondary text uses `on-lid-soft-dark` (7.2:1).

**The One Job Rule.** An ink signals exactly one meaning everywhere. Pink always means "do it", and is never a background flourish.

**The Ink On Ink Rule.** Text on every colored sticker is Ink (#141414), never white: 5.5:1 or better on pink, tomato, lime, sky and butter. Never put gray text on a colored sticker.

**The Two Pinks Rule.** At most two pink stickers per viewport. If everything is an action, nothing is.

## Typography

**Bricolage Grotesque Variable** (optical size 12–96, weight 200–800) sets every word in the system: chunky, slightly quirky and fully readable. It is self-hosted through `@fontsource-variable/bricolage-grotesque`, never loaded from a font CDN in the shipped package. Monospace (`ui-monospace` stack) appears only in code.

**Character:** one quirky grotesque doing every job: chunky and sticker-loud at 96px with optical size 96, plain and readable at 16px.

The face is carried by pixel3d's own token, `--font-p3d`. `--font-sans` is set to it, but every component and the root use `--font-p3d` directly, so a host app's `--font-sans` (shadcn's `@theme inline`, for example) cannot override the sticker face.

### Hierarchy
- **Display** (800, 60px → 72px → 96px at sm/lg, optical size 96, -0.03em, line-height 0.95): hero moments only.
- **H1** (800, 48px → 64px, -0.025em) / **H2** (800, 36px → 44px, -0.02em) / **H3** (700, 28px → 32px) / **H4** (700, 24px). Headings balance their wrap.
- **Lead** (500, 22px, line-height 1.45, 60ch): one intro line under a page heading.
- **Control label** (800, 16–20px by size; tabs and navigation triggers 17px): buttons, tabs, chips.
- **Body** (500, 18px, line-height 1.55, 68ch measure) for prose paragraphs and lists. **Body small** (500, 16px) is the root size and the size of field labels, menu items and descriptions.
- **Floor** (800, 14px): the absolute minimum, used by badges, key caps, menu shortcuts, small avatars and chart ticks.

Tables and data use tabular numerals.

**The No Squint Rule.**
- Body text is never below 16px, and nothing anywhere is below 14px: labels, tooltips, badges, captions, table cells, legal text.
- No uppercase tracked micro-labels.
- If it needs to be smaller to fit, cut it instead.

The type scale enforces this: Tailwind's `text-xs` is redefined to 14px, so the smallest step in the system is the floor.

**The Few Voices Rule.** This rule caps the number of *places* text appears, never its length:
- Each section has at most three text elements: a heading, one line, and an action.
- Each component has one text role per slot.
- These are banned: eyebrows or kickers above headings, captions under images, meta rows ("5 min read · Nov 2026"), and subtitle + description + footnote stacks.
- Helper text appears only when it prevents an error.
- A badge on every item is banned too.

## Layout

- **The 4px grid:** the pixel unit (`--p3d-u`, 4px) drives every size, gap and offset. Component internals step through 4, 8, 12, 16, 20, 24, 28 and 32px; larger page gaps stay on the same 4px grid.
- **Calm structure, playful stickers:** grids, forms and tables are straight and aligned. Only small standalone stickers sit crooked.
- **Active empty space:** bare lid around a sticker is a design element. Leave a quiet field instead of adding another label.
- **Rhythm:** tight groups, generous separation, and more space above a heading than below it.
- **Touch size:** interactive stickers are 40px tall at the smallest (small buttons), 44–48px by default.
- **Responsive:** Tailwind's breakpoints (640 / 768 / 1024px). Headings step down a size below `md`. Docs pages sit in a 1440px-wide container.
- **Stacking:** the shared three.js canvas is fixed full-viewport at z-index 30 with no pointer events. Working DOM stickers that share space with 3D voxels sit at z-index 35, above the canvas, and the sticky site header sits at 40. Overlays (menus, selects, dialogs) sit at 50.

**The Crooked Rule.**
- Small standalone stickers (buttons, badges, tags, chips, cards, avatars) rest tilted, deterministically per instance, between -2.5° and +2.5°.
- Fields, tables, menus, dialog bodies and long text are always straight. Readability beats charm.

The angle comes from a seeded hash of React's `useId`, so server and client agree. Cards tilt at most ±1.5° and only when asked; badges default to -2°.

## Elevation & Depth

Depth is a sticker's physical relationship with the lid. There is one light, coming from above. Shadows are soft and colored from `--p3d-shadow` (a cool near-black in light, pure black in dark); there are no hard zero-blur offsets.

### Shadow Vocabulary
- **Rest** (`drop-shadow(0 6px 5px rgb(shadow / 0.28))`): stuck flat with a slight lip.
- **Peel / hover** (`0 14px 14px` at 24%): the sticker lifts, straightens to 0°, scales up to 1.04 and translates up 5px.
- **Big peel** (`0 18px 18px` at 22%): interactive cards don't scale; they lift a corner in CSS 3D (perspective 900px, rotateX 5°, rotateY -4°, up 6px).
- **Slap / press** (`0 2px 2px` at 30%): scales to 0.94 and springs back, in 90ms.
- **Pressed-in** (no shadow): selected toggles, tabs, radio cards and disabled stickers lie flat against the lid.
- **Recessed** (`inset 0 4px 4px` at 12%): skeleton blocks are wells in the lid, not stickers.

### Motion
- **Peel spring:** `cubic-bezier(.3, 1.7, .5, 1)` over 260ms (320ms for big stickers). The overshoot is the slap; it is deliberate, and a detector's bounce-easing advisory is accepted for this curve.
- **Overlay ease:** out-expo `cubic-bezier(.16, 1, .3, 1)`. Popovers and menus drop in over 320ms; dialogs slap in over 420ms; sheets slide from their edge with a small settle over 460ms; exits lift out with `ease-in` in 120–220ms.
- **Pixel things:** spinners, skeleton sweeps, progress scans, the toast drop and the OTP caret use `steps()`.
- **Commit moments** (check, submit, success): a small sticker *lands* (scale 1.3 → 1, rotating in from -14° to settle at -4°). The container never jumps. Unchecking peels it back off.
- **Unfold:** accordion and collapsible content hinges open from its top edge in 3D.
- **Stamp:** a checkbox is the one control whose whole sticker changes when you commit. It turns lime with a pixel check and thunks down (1.18 → 0.92 → 1 over 320ms). Unchecking springs it back from 0.88.
- **Intro:** blocks drop 12px into place over 280ms on the peel spring, 40ms apart, with the delay capped at the 7th child. Only small loose stickers also tumble (from −6° at 1.06×); blocks and text never rotate. Intros animate `translate`, `rotate` and `scale` (never `transform`) so they compose with crooked tilt and peel. A page's blocks intro on a hard load only (`intro-page`); sections below the fold wait until they scroll into view (`Reveal`). Content already on screen is never hidden.
- **Slide:** a route change never waits on an exit. The router swaps the page and the new page sheet snaps in: a hard attack from 28px right that overshoots to −4px by 45% of 260ms, then settles. It starts at 60% opacity and is opaque at the overshoot, because a slow fade reads as soft. Header and sidebar stay put. No View Transitions: the page never becomes its own stacking context, so the shared 3D canvas layering is untouched.

### Three.js
One shared WebGL canvas per page draws the showpiece 3D:
- voxel stickers that flutter, spin, or peel toward you on hover
- sticker bursts on success
- voxel text
- hero scenes

Every 3D sticker renders into that one canvas through a scissored view; never create a second Canvas. The canvas renders `flat` (no tone mapping, so inks keep their exact hex), mounts on idle after first paint, and each 3D sticker shows a crisp SVG of the same pixel pattern until it is ready. Dense controls are always CSS.

**The Peel Rule.** Hover lifts and straightens, and press slaps. Every interactive sticker answers touch with the same physics, so the whole kit feels like one material.

**The Still Rule.** Under `prefers-reduced-motion`: no peel tilt, no flutter, no bursts, no intros, no page slide (navigation is instant). State changes are instant color swaps. Static resting tilt may stay.

## Shapes

- **Pixel-stepped silhouettes:** no smooth border radius anywhere; the radius scale is set to `initial`.
  - Controls up to 48px tall have one-step notched corners (4px).
  - Cards, dialogs, sheets, menus and name-tag fields have three-step corners (three 4px steps, 12px deep).
  - Notches are drawn with shadows or masks, never with many-vertex `clip-path` polygons. Things that can't be a `sticker` (skeletons, avatar images) use a conic-gradient mask; flat highlight blocks (menu items, key caps, toasts) use two crossed background layers.
- **Kiss-cut border:** a 4px white outline traces the stepped silhouette of every sticker, in both themes.
- **Name-tag fields:** text inputs are name-tag stickers. A colored header band carries the label, and you write on the white area below.
- **Pixel rules:** dividers are 4px dotted rules (4px dots, 8px period); table rows are separated by 2px dashed ink at 30%.
- **Pixel icons:** one pixel-grid icon set (pixelarticons) in Ink, rendered crisp (`shape-rendering: crispEdges`) at multiples of the 4px grid (16, 20, 24, 32 or 48px).
- **Voxels:** 3D objects are extruded pixel art, so a heart is a heart made of cubes.

**The Stepped Edge Rule.** Every edge is a staircase on the 4px grid. A smooth curve anywhere is a bug.

## Components

68 components share the one sticker material. Each family below states its shape, inks and states.

### Buttons
Tactile and confident: a sticker you want to press.
- **Shape:** one-step notched sticker, 48px tall by default (40 / 56px for small / large, 48px square for icon buttons). Control label weight, -0.01em.
- **Variants:** primary (pink), secondary (paper), success (lime), destructive (tomato), ink (black face, white text), ghost (no sticker, text on lid with a 10% tint on hover).
- **States:** peel on hover, slap on press, sky kiss-cut on keyboard focus. Disabled is a blank, flat, still sticker in Blank Vinyl. Loading shows an 8-block pixel spinner that rotates in 8 steps.
- **Button group:** buttons fuse into one straight strip with a single kiss-cut. Only the two outer ends keep their notches; ink dotted pixel rules divide the segments; hover darkens the face instead of peeling.

### Badges and Chips
- **Style:** a 32px tiny sticker, 14px extra-bold, crooked (default -2°). Any ink face; paper by default.
- **Category / track badges** are sky: they carry information, never an action.
- Use sparingly: never a badge on every item.

### Cards / Containers
- **Corner Style:** three-step stepped corners.
- **Background:** paper by default; pink, lime, sky, butter or ink faces exist for single feature stickers.
- **Shadow Strategy:** rest lip; `interactive` cards get the big 3D corner peel.
- **Internal Padding:** 28px, 20px between children. Media bleeds to the cut.
- Content is one heading (24px, 800), one line, one action. Never nest cards.

### Inputs / Fields
- **Style:** fields are name-tag stickers with three-step corners. The band carries the label and its state: rest = ink band with white label, focus = sky band with ink label (and a sky kiss-cut), invalid = tomato band, where the error message replaces the label. Disabled is blank.
- **Writing panel:** a 48px white panel, 18px medium text, a pink caret, Hint Gray placeholders, Ink Soft field icons.
- **No band:** a field with no visible label (search) is a plain white tag.
- **Errors outside a band** (checkbox, radio, switch groups): a straight tomato sticker with a pixel warning icon, written as the problem and the fix. It drops in.
- Fields never tilt.

### Checkbox, Radio, Switch
- **Checkbox:** a stamp. A blank 36px paper sticker; checking turns the whole sticker lime with a chunky ink pixel check (2-wide strokes on a 9×6 grid, 27×18px) and thunks it down (`animate-stamp`: 1.18 → 0.92 → 1, 320ms peel spring). Unchecking returns it to paper with a small spring (`animate-unstamp`). Indeterminate is the same lime stamp with a pixel bar. No animation on first paint.
- **Radio cards:** large paper stickers that turn lime and lie flat when checked; an ink mini-sticker lands in the corner.
- **Switch:** a 76×40px paper track with a 26px ink block knob. On turns the track sky and the knob springs across on the peel curve.

### Tabs and Toggles
- Tabs are a row of crooked paper stickers (44px, 17px label). The selected one turns lime, straightens and lies flat. Panels drop in.
- Toggles and toggle groups follow the same rule: on = lime, flat, straight.

### Menus, Select and Command
- **Surface:** a straight paper sticker with three-step corners that drops in. Never tilted.
- **Menu highlight is pink:** the highlighted item in a dropdown, context menu or menubar is a pink notched pixel block, because a menu item is an action. Destructive items highlight tomato.
- **List and command highlight is lime:** the highlighted item in a command palette or list is a lime block, because it marks what is chosen. A checked item in a select or menu lands a lime check-sticker.
- Shortcuts sit on light paper key caps at 14px.

### Navigation
- **Navigation menu:** paper sticker triggers; the active item turns lime and lies flat.
- **Sidebar:** a recessed lid-deep panel; the active item is a crooked pink sticker. On mobile it slides in from the left.
- **Breadcrumb:** the current page is a small crooked pink sticker.
- **Stepper:** done = lime, current = pink, upcoming = paper.

### Overlays and Feedback
- **Dialogs and alert dialogs:** big straight stickers that slap in over an ink overlay. Scrolling lives on an inner wrapper.
- **Sheets:** slide from their edge with a 1–2° settle.
- **Toasts:** crooked stickers that drop onto the lid with a stepped bounce. Default paper, success lime, error tomato, warning butter, info sky. A small paper close sticker sits on the corner.
- **Alerts:** straight stickers in the semantic inks (info sky, success lime, warning butter, destructive tomato).

### Data
- **Table:** straight, tabular numerals, dashed pixel separators between rows.
- **Progress / XP bar:** a pink fill quantised to whole 8px blocks, so it grows one block at a time; indeterminate progress scans in steps.
- **Skeleton:** a recessed lid-deep well with a dithered checker band that sweeps in steps.
- **Chart:** Recharts with crisp 2px axes, dashed grid at 22%, square line caps and 14px tabular ticks. Series take the inks in order (pink, sky, lime, butter, tomato).
- **Carousel:** cover-flow; the centered slide straightens, lifts and peels, side slides rotate away in 3D.

### Leaderboard (signature)
Ranked rows of straight paper stickers with pixel-block score bars. Only rank 1 wears lime; ranks 2 and 3 stay paper and carry a pixel trophy; ranks 4 and below sit on a recessed lid face. Rank is not an ink's job. When the order changes, rows slide to their new place on the peel spring instead of jumping.

### Kit extras
- **Kbd:** a straight 32px paper key cap with a 4px recessed lip along the bottom.
- **Avatar:** a small crooked square sticker; without a photo, initials sit on an ink face picked from the name. Groups overlap with alternating tilts.
- **Countdown:** each unit sticker flips on its X axis, swapping the number when edge-on.
- **Dropzone:** an empty sticker slot drawn as a stepped dotted outline on the lid; while a file hovers it becomes a lifted sky sticker.
- **Mark:** a pink highlighter sticker behind a few words, one per section.
- **Blockquote:** a straight paper sticker with an ink pixel quote mark, never a border-left.

### Implementation invariants
- Never put `overflow` on a `sticker` element: it clips the stepped corners and the kiss-cut. Scroll or clip on an inner wrapper.
- The lid background and the font are also applied by unlayered `html, body` rules, on purpose, so they win over a host app's base layer (shadcn's default globals paint their own background and font).

## Do's and Don'ts

### Do:
- **Do** make every button, field, toggle, chip, card and dialog a pixel-art sticker, with a stepped silhouette and a kiss-cut border.
- **Do** give every interactive sticker the same peel-on-hover and slap-on-press physics, on the `cubic-bezier(.3, 1.7, .5, 1)` spring.
- **Do** use one ink per meaning: pink acts, lime chooses, sky turns on, tomato destroys, butter warns.
- **Do** put Ink text on colored stickers and check contrast in both themes (≥4.5:1 body, ≥3:1 large).
- **Do** theme browser surfaces: pink selection, a pink caret (a blinking pink block in OTP slots), a 4px sky focus outline or sky kiss-cut, an ink-on-lid scrollbar, tabular numerals in data.
- **Do** let bare lid be the breathing room.
- **Do** render every 3D sticker into the one shared canvas, below working DOM stickers (z-35) and the sticky header (z-40).
- **Do** scroll inside a sticker on an inner wrapper.

### Don't:
- **Don't** use smooth `border-radius`, gradient text, glass or blur effects, or purple-to-blue gradients.
- **Don't** add eyebrow or kicker labels, section numbers (01/02/03), nested cards, or grids of identical icon + heading + text cards as page structure.
- **Don't** use the hero-metric template (big number, small label, supporting stats).
- **Don't** set body text in a pixel font, and don't use monospace except for code.
- **Don't** use emoji or Unicode glyphs as icons.
- **Don't** add colored `border-left` callouts.
- **Don't** use black outline 8-bit chrome, thick black borders, or hard zero-blur offset shadows. Stickers cast soft shadows.
- **Don't** tilt fields, tables, menus or long text.
- **Don't** set text below 14px, or body text below 16px.
- **Don't** celebrate an ordinary click. Bursts are for real milestones.
- **Don't** create a second three.js Canvas.
- **Don't** put `overflow` on a `sticker` element.

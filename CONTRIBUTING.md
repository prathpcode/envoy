# Building a pixel3d-ui component

Read `DESIGN.md` first. It is law. This file covers the mechanics.

## Repo map

```
packages/ui/src/
  styles/pixel3d.css      the sticker material: tokens + utilities (read it!)
  lib/utils.ts            cn(), useTilt(), seededUnit()
  components/<name>.tsx   one file per component (kebab-case)
  three/                  shared-canvas three.js pieces (StickerCanvas, Sticker3D, VoxelSticker, patterns)
apps/docs/
  content/components/<slug>.tsx   the doc module for a component (exports `doc: ComponentDoc`)
  demos/<slug>/<id>.tsx           one live demo per file; its source is shown in the Code tab
  lib/types.ts                    ComponentDoc / DemoDef / PropDef types + CATEGORIES
scripts/gen-ui-index.mjs          regenerates packages/ui/src/index.ts + three/index.ts
apps/docs/scripts/gen-index.mjs   regenerates apps/docs/content/components/_index.ts
```

**Reference implementations (copy their shape exactly):**
- components: `button.tsx`, `input.tsx`, `checkbox.tsx`, `switch.tsx`, `tabs.tsx`, `card.tsx`, `badge.tsx`
- 3D: `three/sticker-3d.tsx`, `three/voxel-sticker.tsx`
- docs: `apps/docs/content/components/button.tsx` + `apps/docs/demos/button/*.tsx`

## The material (from `pixel3d.css`)

| Utility | What it does |
|---|---|
| `sticker` | Base sticker: 1-step notched silhouette (::before) + 4px white kiss-cut + soft lip shadow. Sets `position: relative; isolation: isolate`. |
| `sticker-lg` | Add with `sticker` for 3-step corners (cards, dialogs, sheets, panels, menus, popovers). |
| `face-paper` / `face-pink` / `face-lime` / `face-sky` / `face-tomato` / `face-butter` / `face-ink` / `face-lid` | Sets `--face` (sticker colour) and the text colour. |
| `sticker-flat` | No lip shadow (selected / pressed-in). |
| `peel` | Hover lifts, straightens and scales; press slaps. For small interactive stickers. |
| `peel-3d` | Gentle 3D corner-peel for big stickers (cards). |
| `crooked` | Applies the resting `--p3d-tilt` angle (non-interactive stickers). |
| `focus-cut` / `focus-within-cut` | Focus turns the kiss-cut sky. Use these instead of outline rings on stickers. |
| `sticker-disabled` | Blank, flat, still when `:disabled` / `aria-disabled` / `data-disabled`. |
| `pixel-icon` | Crisp SVG rendering. |
| `pixel-rule` | A 4px dotted pixel divider. |
| `overlay-motion` | Radix `data-state` open/closed: drop-in / lift-out. Put it on popover, menu, dialog and tooltip content. |
| `animate-land` / `animate-peel-off` / `animate-slap` / `animate-stamp` / `animate-unstamp` / `animate-drop-in` / `animate-lift-out` | Keyframe utilities. |
| `intro` / `intro-stagger` / `intro-page` / `intro-tumble` | Stuck on at mount, 40ms apart. `intro-page` plays on a hard load only (route changes slide instead). `intro-tumble` adds rotate + scale for small loose stickers only. Animates `translate`/`rotate`/`scale`, so it composes with tilt. |

Colour utilities: `bg-pink text-ink bg-lime bg-sky bg-tomato bg-butter bg-ink bg-paper text-ink-soft bg-lid bg-lid-deep text-on-lid text-on-lid-soft`, plus `ease-peel` and `ease-out-expo`.

**Important mechanics:**
- The silhouette is drawn by `::before`, so **never** put `overflow-hidden` on a `sticker` element (it would clip the stepped corners). Use an inner wrapper for scrolling or clipping.
- `filter` makes a stacking context. Popovers and menus must portal (Radix Portal) so they aren't trapped.
- The sticker's visual edge is the element's box, and the white kiss-cut adds 4px outside it. Leave ≥ 12px gap between stickers.
- Tailwind `rounded-*` does not exist in this system (radius tokens are removed). Never use `border-radius`.
- Overlays (dialog, sheet, popover, menus, tooltip) use z-50 or higher. The shared three.js canvas sits at z-30.

## Component rules

1. **Wrap the shadcn/Radix original.** Import primitives from the unified `radix-ui` package (`import { Dialog as DialogPrimitive } from "radix-ui"`). Keep the shadcn API, part names and `data-slot` attributes, so people can switch from shadcn with zero relearning.
2. `"use client"` on interactive components; `React.forwardRef` + `displayName`; style with `cn()`; variants with `cva`.
3. **Every visual surface is a sticker:**
   - **Small standalone stickers** (buttons, badges, chips, avatars, toggles, cards) may be crooked.
   - **Straight:** fields, menus, dialog bodies, tables and long text. Pass tilt 0.
4. **One ink, one job:** pink = act, lime = chosen/success, sky = on/focus/info, tomato = destructive/error, butter = warning, ink and paper = structure.
5. **Text on coloured faces is `text-ink`, never white**, except on `face-ink`, where it's paper.
6. **Type:**
   - Bricolage Grotesque only (`font-sans`); `font-mono` only for code.
   - Control labels are `font-extrabold`, 16–20px.
   - Nothing below `text-sm` (14px): no `text-xs`, no `text-[12px]`.
   - Body text is ≥ 16px.
   - No uppercase tracked micro-labels.
7. **Few Voices:**
   - A component has one text role per slot.
   - No eyebrow labels and no helper text unless it prevents an error.
   - Demos follow it too: short, real, hackathon-flavoured content (teams, projects, tracks, deadlines, demos).
8. **Icons:**
   - Use `pixelarticons/react` only, e.g. `import { Check, ChevronDown } from "pixelarticons/react"`.
   - Valid names are listed in `packages/ui/PIXELARTICONS.txt`. Check the file before importing. Some common names don't exist: `Info` → `InfoBox`, `Alert` → `SquareAlert`/`WarningDiamond`, `Settings` → `Gear`/`SettingsCog`, `EyeClosed` → `EyeOff`, `Drag` → `DragAndDrop`.
   - Never use emoji, Unicode glyphs or lucide.
9. **Motion:**
   - Interactive stickers get `peel` (or `peel-3d`). Overlays get `overlay-motion`.
   - Commit moments get `animate-land`. Never animate the container jumping.
   - Pages and sections arrive with `Intro` / `Reveal` (or `intro-stagger`). The app shell wraps routes in `<PageTransitions>` and its main region in `<PageSheet>`. Never animate `transform` in an intro (it fights crooked tilt), never rotate blocks or text, and never make a navigation wait on an animation.
   - Everything must respect reduced motion; the CSS already does globally, so don't fight it.
10. **Accessibility (WCAG 2.2 AA):**
    - Keep Radix semantics.
    - Icon-only controls need `aria-label`.
    - Visible focus comes via `focus-cut` / `focus-within-cut`.
11. **No banned patterns** (DESIGN.md Do's & Don'ts): no gradients-as-decoration, glass/blur, border-left callouts, nested cards, smooth radius, black 8-bit outlines, or hard zero-blur offset shadows.

## 3D components

- Render through the shared canvas: put a drei `<View>` inside your DOM box (see `three/sticker-3d.tsx`). **Never create a new `<Canvas>`.**
- Read readiness with `useStickerCanvas()`. Render a static SVG/DOM fallback while `!ready`.
- Inks in 3D use the same hex values. The canvas is `flat` (no tone mapping), so colours match CSS.
- Stop idle motion under `prefers-reduced-motion`.

## Docs for each component

1. **Demos.** Write `apps/docs/demos/<slug>/<id>.tsx`, each with a default-export React component.
   - Demos render inside a centred flex stage (gap-8), so wrap in a sized div when you need width (e.g. `w-full max-w-md`).
   - Add `"use client"` when using state.
   - Import from `"@pixel3d/ui"` (or `"@pixel3d/ui/three"`), exactly as users would.
2. **Doc module.** Write `apps/docs/content/components/<slug>.tsx` exporting `doc: ComponentDoc` (see `lib/types.ts`).
   - `slug`, `name` and `category` must be **string literals on their own lines** (the indexer greps them).
   - `category` must be one of: `Actions`, `Forms`, `Overlays`, `Navigation`, `Data display`, `Feedback`, `Layout`, `3D`, `Hackathon kit`.
   - `summary`: one sentence.
   - `usage`: imports from `@/components/ui/<name>` (the shadcn install path).
   - Include `props` rows for every custom prop, `a11y` lines, and short `do` / `dont` lists.
   - `files`: paths relative to `packages/ui/src`, e.g. `["components/dialog.tsx", "lib/utils.ts"]`.
   - `dependencies`: npm packages; `registryDependencies`: other pixel3d slugs it imports.
3. **Regenerate the indexes.** From the repo root run `node scripts/gen-ui-index.mjs && node apps/docs/scripts/gen-index.mjs`.

## Verify before you're done

- `cd packages/ui && npx tsc -p tsconfig.json`: zero errors.
- `cd apps/docs && npx tsc --noEmit`: zero errors (run `node scripts/gen-index.mjs` there first).
- The docs dev server runs at http://localhost:3000. Check the page: `curl -s http://localhost:3000/docs/components/<slug> -o /tmp/p.html -w "%{http_code}"` returns 200, and the HTML contains your component's name and no "Unhandled Runtime Error" or "Error:" overlay text.
- Don't run `pnpm install` or add dependencies without saying so in your report. Everything listed in `packages/ui/package.json` is already installed.
- Never commit.

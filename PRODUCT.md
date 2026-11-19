# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

pnpm + Turborepo monorepo. Next.js (App Router) for the docs site (`apps/docs`) and the sample site (`apps/demo`). Components are built on shadcn/ui conventions over Radix primitives with Tailwind CSS v4. The optional 3D addon uses React Three Fiber.

## Users

Hackathon developers on a deadline: solo devs or small teams who know React/Next.js, have 24 to 48 hours, little design training, and need their project to look finished and grab judges' attention at demo time. What they care about most is install speed and a UI that looks complete the moment it renders.

## Product Purpose

pixel3d-ui is a component library that gives every common UI component (buttons through data tables, dialogs, sidebars and charts) a pixel-art look with real 3D depth. A hackathon project built with it looks deliberate, playful and memorable without a designer on the team. Success means a team can install it, build its real screens in hours, and stand out on demo day, with no design work of their own.

## Positioning

Other pixel UI kits are flat reskins. pixel3d-ui pairs a pixel-art language with a real 3D depth system across every component: voxel extrusion, physical press, tilt, flips. An optional WebGL addon covers hero moments. It is also held to a strict anti-slop design floor, so the result reads as designed, not generated.

## Operating Context

- Installed mid-hackathon, usually into a fresh Next.js app.
- Used to build landing pages, sign-up flows, dashboards and demo screens fast.
- Judged on a projector or laptop screen in a noisy room, often in a 2–3 minute demo.
- The sample site, "Hack the Pixel", is a fictional hackathon event site that shows every component in a realistic flow.

## Capabilities and Constraints

- Distributed two ways: as a shadcn registry (`npx shadcn add @pixel3d/<component>`, source copied into the project) and as an npm package (`@pixel3d/ui`).
- Covers the full shadcn/ui component set plus hackathon-specific extras.
- The 3D layer in core components is CSS-only, with zero runtime dependencies. WebGL/R3F lives only in the separate opt-in `@pixel3d/three` package and is never required by core.
- Must work in light and dark themes.

## Brand Commitments

- Name: **pixel3d-ui**. Registry namespace and npm scope: **@pixel3d**.
- Personality: fun, hackathon energy, pixel-art plus 3D. Both of these are pinned by the user.
- The balance is pinned too. It must be fun and quirky to use, but not busy:
  - "Too minimal" was rejected, and so was "too pixely".
  - Every component, buttons included, is pixel-art shaped, yet text stays in a readable typeface.
- Chosen visual world: **Sticker Sheet**, die-cut laptop stickers (see DESIGN.md).
- three.js is a core dependency on one shared canvas for showpiece components. Dense controls stay CSS 3D.
- Keep visible text to as few places as possible, and never use tiny text. See DESIGN.md.

## Evidence on Hand

None yet: no users, testimonials, sponsors, download counts or benchmarks. The demo site's event, teams, projects, prizes and people are fictional and must be labelled as sample content. Never present invented sponsors, prize amounts or adoption numbers as real.

## Product Principles

1. **Finished on first render.** Defaults must look demo-ready with zero customization.
2. **Depth is the signature.** Every component earns its 3D behavior; no component is a flat reskin.
3. **Fast to adopt.** One command per component, familiar shadcn APIs, no new mental model.
4. **Fun never costs access.** Playfulness never breaks keyboard use, screen readers, contrast or reduced motion.
5. **Less text, louder design.** Components speak through form and motion, not labels and captions.

## Accessibility & Inclusion

WCAG 2.2 AA is required for every component:
- full keyboard operation and correct ARIA (inherited from Radix)
- AA contrast in both themes
- visible focus states
- every 3D/tilt/parallax effect turns off under `prefers-reduced-motion`
- no text below 14px

import Link from "next/link";
import { Marquee, PageSheet, Reveal } from "@pixel3d/ui";
import { StickerScene, VoxelText } from "@pixel3d/ui/three";
import { SiteHeader } from "@/components/site-header";
import { InstallHero } from "@/components/landing/install-hero";
import { LiveCollage } from "@/components/landing/live-collage";
import { HeroStickers } from "@/components/landing/hero-stickers";
import { allComponents } from "@/lib/nav";

export default function Home() {
  const names = [...allComponents].sort((a, b) => a.name.localeCompare(b.name));
  const half = Math.ceil(names.length / 2);
  return (
    <div className="min-h-dvh overflow-x-clip">
      <SiteHeader />
      <PageSheet id="content">
        {/* first viewport: the thesis + the working action, 3D stickers around it */}
        <section className="relative mx-auto grid max-w-[1440px] grid-cols-[minmax(0,1fr)] items-center gap-10 px-4 pt-10 pb-20 md:px-8 lg:min-h-[calc(100dvh-5rem)] lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:pt-0">
          <div className="intro-page relative z-10 flex flex-col gap-8">
            <h1 className="text-[clamp(2.75rem,8vw,6rem)] leading-[0.92] font-extrabold tracking-[-0.035em]">
              Sticker UI
              <br />
              for hackathons.
            </h1>
            <p className="max-w-[34ch] text-[22px] leading-snug font-medium text-on-lid-soft">
              Seventy die-cut components with pixel edges and real 3D. Looks finished on first render.
            </p>
            <InstallHero />
          </div>
          {/* 3D cluster is the backdrop; the working stickers are a sibling layered above it */}
          <div className="relative grid h-[560px] w-full place-items-center lg:h-[640px]">
            <StickerScene density={12} label="Floating voxel stickers" className="absolute inset-0" />
            <HeroStickers />
          </div>
        </section>

        {/* proof: the kit working, not a picture of it */}
        <Reveal asChild>
        <section className="mx-auto flex max-w-[1440px] flex-col gap-14 px-4 py-24 md:px-8">
          <div className="flex max-w-3xl flex-col gap-4">
            <h2 className="text-[clamp(2.25rem,5vw,4rem)] leading-none font-extrabold tracking-[-0.03em]">Everything here works.</h2>
            <p className="text-xl text-on-lid-soft">Press the pink one.</p>
          </div>
          <LiveCollage />
        </section>
        </Reveal>

        {/* 3D */}
        <section className="bg-lid-deep/60 py-24">
          <Reveal className="mx-auto flex max-w-[1440px] flex-col items-center gap-10 px-4 text-center md:px-8">
            <VoxelText text={"HACK THE\nPIXEL"} className="w-full max-w-4xl" />
            <h2 className="text-[clamp(2.25rem,4vw,3.5rem)] leading-none font-extrabold tracking-[-0.03em]">Real three.js. One canvas.</h2>
            <Link
              href="/docs/three"
              className="sticker face-paper peel focus-cut px-6 py-3 text-xl font-extrabold [--p3d-tilt:-1.5deg]"
            >
              How the 3D works
            </Link>
          </Reveal>
        </section>

        {/* breadth: every component as a sticker */}
        <Reveal asChild>
        <section className="flex flex-col gap-8 py-24" aria-label="All components">
          <h2 className="mx-auto max-w-[1440px] px-4 text-center text-[clamp(2.25rem,4vw,3.5rem)] leading-none font-extrabold tracking-[-0.03em] md:px-8">
            The whole shadcn set, stuck on.
          </h2>
          {[names.slice(0, half), names.slice(half)].map((row, r) => (
            <Marquee key={r} speed={r ? 28 : 36} direction={r ? "right" : "left"} gap={24}>
              {row.map((c, i) => (
                <Link
                  key={c.slug}
                  href={`/docs/components/${c.slug}`}
                  className={`sticker face-paper peel focus-cut px-5 py-3 text-xl font-extrabold whitespace-nowrap`}
                  style={{ ["--p3d-tilt" as string]: `${((i * 7 + r * 3) % 5) - 2}deg` }}
                >
                  {c.name}
                </Link>
              ))}
            </Marquee>
          ))}
        </section>
        </Reveal>

        {/* close */}
        <Reveal asChild>
        <section className="mx-auto flex max-w-[1440px] flex-col items-start gap-8 px-4 pt-16 pb-32 md:px-8">
          <h2 className="text-[clamp(2.5rem,7vw,5.5rem)] leading-[0.95] font-extrabold tracking-[-0.035em]">
            Ship something
            <br />
            weird this weekend.
          </h2>
          <InstallHero />
        </section>
        </Reveal>
      </PageSheet>
    </div>
  );
}

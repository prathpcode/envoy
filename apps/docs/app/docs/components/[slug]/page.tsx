import fs from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { loaders, meta } from "@/content/components/_index";
import { CodeBlock } from "@/components/code-block";
import { Preview } from "@/components/preview";
import { InstallBlock } from "@/components/install-block";
import { PropsTable } from "@/components/props-table";
import { Badge } from "@pixel3d/ui";

const DOCS_ROOT = process.cwd();

export function generateStaticParams() {
  return meta.map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const m = meta.find((x) => x.slug === slug);
  return { title: m?.name ?? "Component" };
}

async function readDemo(slug: string, id: string) {
  try {
    return await fs.readFile(path.join(DOCS_ROOT, "demos", slug, `${id}.tsx`), "utf8");
  } catch {
    return "// source not found";
  }
}

export default async function ComponentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const load = loaders[slug];
  if (!load) notFound();
  const { doc } = await load();

  const demos = await Promise.all(
    doc.demos.map(async (d) => ({ ...d, source: await readDemo(slug, d.id) }))
  );

  return (
    <article className="intro-page flex flex-col gap-14 pb-24">
      <header className="flex flex-col gap-6">
        <div className="flex flex-wrap items-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-[-0.03em] md:text-6xl">{doc.name}</h1>
          {doc.three && <Badge tone="sky" tilt={2}>three.js</Badge>}
        </div>
        <p className="max-w-[60ch] text-xl leading-relaxed text-on-lid-soft">{doc.summary}</p>
        <InstallBlock slug={slug} />
      </header>

      {demos.map((d) => (
        <Preview
          key={d.id}
          title={d.title}
          stage={d.stage}
          height={d.height}
          codeHtml={<CodeBlock code={d.source.trimEnd()} />}
        >
          <d.Component />
        </Preview>
      ))}

      <section className="flex flex-col gap-4">
        <h2 className="text-3xl font-extrabold tracking-[-0.02em]">Usage</h2>
        <CodeBlock code={doc.usage.trim()} />
      </section>

      {doc.props?.map((p) => (
        <section key={p.component} className="flex flex-col gap-4">
          <h2 className="text-3xl font-extrabold tracking-[-0.02em]">{p.component} props</h2>
          <PropsTable rows={p.rows} />
        </section>
      ))}

      {(doc.do?.length || doc.dont?.length) && (
        <section className="grid gap-8 md:grid-cols-2">
          {doc.do?.length ? (
            <div className="sticker sticker-lg face-lime flex flex-col gap-4 p-7">
              <h2 className="text-2xl font-extrabold">Do</h2>
              <ul className="flex flex-col gap-3 text-[17px] leading-snug">
                {doc.do.map((t) => (
                  <li key={t} className="flex gap-3"><span aria-hidden className="mt-2 size-2 shrink-0 bg-ink" />{t}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {doc.dont?.length ? (
            <div className="sticker sticker-lg face-tomato flex flex-col gap-4 p-7">
              <h2 className="text-2xl font-extrabold">Don’t</h2>
              <ul className="flex flex-col gap-3 text-[17px] leading-snug">
                {doc.dont.map((t) => (
                  <li key={t} className="flex gap-3"><span aria-hidden className="mt-2 size-2 shrink-0 bg-ink" />{t}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>
      )}

      {doc.a11y?.length ? (
        <section className="flex flex-col gap-4">
          <h2 className="text-3xl font-extrabold tracking-[-0.02em]">Accessibility</h2>
          <ul className="flex max-w-[70ch] flex-col gap-3 text-lg">
            {doc.a11y.map((t) => (
              <li key={t} className="flex gap-3"><span aria-hidden className="mt-2.5 size-2 shrink-0 bg-on-lid" />{t}</li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}

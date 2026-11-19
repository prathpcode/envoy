import type { PropDef } from "@/lib/types";

/** Props reference. Table from sm up; stacked rows on phones so nothing hides off-canvas. */
export function PropsTable({ rows }: { rows: PropDef[] }) {
  return (
    <div className="sticker sticker-lg face-paper p-3 text-ink">
      {/* phones: one stacked row per prop */}
      <dl className="flex flex-col sm:hidden">
        {rows.map((r) => (
          <div key={r.name} className="flex flex-col gap-2 border-b-2 border-dashed border-ink/20 px-3 py-4 last:border-0">
            <dt className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="font-mono text-[15px] font-bold">{r.name}</span>
              <span className="font-mono text-[15px] break-all text-ink-soft">{r.type}</span>
            </dt>
            <dd className="text-[16px] leading-snug">
              {r.description}
              {r.default ? <span className="mt-1 block font-mono text-[15px] text-ink-soft">Default {r.default}</span> : null}
            </dd>
          </div>
        ))}
      </dl>
      {/* sm and up: table (the scroller is an inner wrapper, never the sticker) */}
      <div className="hidden overflow-x-auto sm:block">
        <table className="w-full table-fixed border-collapse text-left text-[16px]">
          <thead>
            <tr className="border-b-4 border-ink">
              <th className="w-[17%] px-4 py-3 font-extrabold">Prop</th>
              <th className="w-[24%] px-4 py-3 font-extrabold">Type</th>
              <th className="w-[21%] px-4 py-3 font-extrabold">Default</th>
              <th className="px-4 py-3 font-extrabold">What it does</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name} className="border-b-2 border-dashed border-ink/20 align-top last:border-0">
                <td className="px-4 py-3 font-mono text-[15px] font-bold">{r.name}</td>
                <td className="px-4 py-3 font-mono text-[15px] break-words text-ink-soft">{r.type}</td>
                <td className="px-4 py-3 font-mono text-[15px] break-words text-ink-soft">{r.default ?? "—"}</td>
                <td className="px-4 py-3 leading-snug">{r.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

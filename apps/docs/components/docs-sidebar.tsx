import { guides, componentNav } from "@/lib/nav";
import { NavLink } from "./nav-link";

export function NavTree() {
  return (
    <nav aria-label="Docs" className="flex flex-col gap-8 pb-16">
      <div className="flex flex-col gap-1">
        <p className="px-3 pb-2 text-lg font-extrabold">Guides</p>
        {guides.map((g) => (
          <NavLink key={g.href} href={g.href}>{g.title}</NavLink>
        ))}
      </div>
      {componentNav().map((group) => (
        <div key={group.category} className="flex flex-col gap-1">
          <p className="px-3 pb-2 text-lg font-extrabold">{group.category}</p>
          {group.items.map((c) => (
            <NavLink key={c.slug} href={`/docs/components/${c.slug}`}>{c.name}</NavLink>
          ))}
        </div>
      ))}
    </nav>
  );
}

export function DocsSidebar() {
  return (
    <aside className="sticky top-24 hidden h-[calc(100dvh-6rem)] w-64 shrink-0 overflow-y-auto pt-10 pr-2 lg:block">
      <NavTree />
    </aside>
  );
}

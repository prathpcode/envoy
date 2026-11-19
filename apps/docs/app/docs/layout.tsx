import { DocsSidebar } from "@/components/docs-sidebar";
import { SiteHeader } from "@/components/site-header";
import { PageSheet } from "@pixel3d/ui";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh">
      <SiteHeader />
      <div className="mx-auto flex max-w-[1440px] gap-12 px-4 md:px-8">
        <DocsSidebar />
        <PageSheet id="content" className="min-w-0 flex-1 pt-10">
          {children}
        </PageSheet>
      </div>
    </div>
  );
}

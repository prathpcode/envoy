import type { ComponentDoc } from "@/lib/types";
import Projects from "@/demos/data-table/projects";

export const doc: ComponentDoc = {
  slug: "data-table",
  name: "DataTable",
  category: "Data display",
  summary: "A ready-made table on TanStack Table v9 with sorting, search, row selection and pages.",
  files: ["components/data-table.tsx", "components/table.tsx", "styles/data.css", "lib/utils.ts"],
  dependencies: ["@tanstack/react-table", "pixelarticons"],
  registryDependencies: ["table", "button", "checkbox", "input"],
  demos: [{ id: "projects", title: "Sortable projects", Component: Projects, height: 640 }],
  usage: `
import { DataTable, createDataTableColumnHelper } from "@/components/ui/data-table";

type Project = { id: string; team: string; commits: number };
const col = createDataTableColumnHelper<Project>();
const columns = col.columns([
  col.accessor("team", { header: "Team" }),
  col.accessor("commits", { header: "Commits", sortDescFirst: true }),
]);

<DataTable columns={columns} data={projects} getRowId={(p) => p.id} />
`,
  props: [
    {
      component: "DataTable",
      rows: [
        { name: "columns", type: "DataTableColumnDef<TData>[]", description: "TanStack v9 column defs. Build them with createDataTableColumnHelper and keep them stable." },
        { name: "data", type: "TData[]", description: "Rows. Keep the array stable (state, memo or module scope)." },
        { name: "getRowId", type: "(row, index) => string", description: "Stable ids keep selection right across sorting and pages." },
        { name: "enableRowSelection", type: "boolean", default: "true", description: "Adds the checkbox column. Shift-click selects a range." },
        { name: "enableSearch", type: "boolean", default: "true", description: "Shows the global search field." },
        { name: "searchLabel", type: "string", default: '"Search"', description: "Accessible name and placeholder of the search field." },
        { name: "pageSize", type: "number", default: "8", description: "Rows per page." },
        { name: "emptyMessage", type: "ReactNode", default: '"Nothing matches that search."', description: "Shown when no row matches." },
        { name: "onSelectionChange", type: "(rows: TData[]) => void", description: "Fires with the selected rows' data." },
        { name: "toolbar", type: "ReactNode", description: "Extra controls beside the search field." },
      ],
    },
  ],
  a11y: [
    "Sortable headers are buttons, and each header reports aria-sort.",
    "Every checkbox has a label; the header one selects the current page.",
    "Prev and next are labelled icon buttons that disable at the ends.",
    "The selected count is announced politely as it changes.",
  ],
  do: ["Pass getRowId so selection survives sorting.", "Mark columns that shouldn't be searched with enableGlobalFilter: false."],
  dont: ["Don't rebuild columns on every render.", "Don't use v8's useReactTable: this is v9's useTable."],
};

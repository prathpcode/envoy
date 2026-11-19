import type { ComponentDoc } from "@/lib/types";
import Submissions from "@/demos/table/submissions";

export const doc: ComponentDoc = {
  slug: "table",
  name: "Table",
  category: "Data display",
  summary: "A plain HTML table printed on one straight paper sticker, with an ink header rule and dashed pixel rows.",
  files: ["components/table.tsx", "styles/data.css", "lib/utils.ts"],
  dependencies: [],
  demos: [{ id: "submissions", title: "Submissions", Component: Submissions, height: 420 }],
  usage: `
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";

<Table>
  <TableHeader>
    <TableRow><TableHead>Team</TableHead><TableHead>Commits</TableHead></TableRow>
  </TableHeader>
  <TableBody>
    <TableRow data-state="selected"><TableCell>Null Pointers</TableCell><TableCell>212</TableCell></TableRow>
  </TableBody>
</Table>
`,
  props: [
    {
      component: "Table",
      rows: [
        { name: "containerClassName", type: "string", description: "Classes for the paper sticker around the table (width, margin)." },
      ],
    },
    {
      component: "TableRow",
      rows: [
        { name: "data-state", type: '"selected"', description: "Turns the row lime. DataTable sets it for you." },
      ],
    },
  ],
  a11y: [
    "Real <table>, <th> and <caption> semantics, so screen readers announce rows and columns.",
    "Wide tables scroll inside the sticker; the sticker itself never clips.",
    "Numbers use tabular figures, so columns of digits line up.",
  ],
  do: ["Right-align number columns.", "Use the caption for the one fact the table needs, like when it was locked."],
  dont: ["Don't tilt a table: data stays straight.", "Don't put a badge in every row."],
};

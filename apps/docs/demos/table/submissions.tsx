import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@pixel3d/ui";

const submissions = [
  { team: "Null Pointers", project: "Lidar Lunchbox", track: "Weird Hardware", commits: 212 },
  { team: "Off By One", project: "Queue Tips", track: "Best Dev Tool", commits: 188 },
  { team: "Cache Me Outside", project: "Greenhouse.exe", track: "Greenest Build", commits: 154, picked: true },
  { team: "Lambda Llamas", project: "Signbridge", track: "Most Accessible", commits: 131 },
  { team: "Tab Hoarders", project: "Voxelvote", track: "Best Use of Voxels", commits: 97 },
];

export default function TableSubmissions() {
  const total = submissions.reduce((n, s) => n + s.commits, 0);
  return (
    <div className="w-full max-w-3xl">
      <Table>
        <TableCaption>Locked at 09:00 Sunday.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Team</TableHead>
            <TableHead>Project</TableHead>
            <TableHead>Track</TableHead>
            <TableHead className="text-right">Commits</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions.map((s) => (
            <TableRow key={s.team} data-state={s.picked ? "selected" : undefined}>
              <TableCell className="font-extrabold">{s.team}</TableCell>
              <TableCell>{s.project}</TableCell>
              <TableCell>{s.track}</TableCell>
              <TableCell className="text-right">{s.commits}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={3}>Total</TableCell>
            <TableCell className="text-right">{total}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

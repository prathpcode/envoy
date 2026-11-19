import { CodeBlock } from "@pixel3d/ui";

export default function CodeBlockShell() {
  return (
    <div className="w-full max-w-2xl">
      <CodeBlock code={`# grab the kit\nnpx shadcn@latest add @pixel3d/countdown @pixel3d/leaderboard`} />
    </div>
  );
}

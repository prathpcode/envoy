import { CodeBlock } from "@pixel3d/ui";

const code = `// submit before the countdown hits zero
import { submit } from "./hackathon";

export async function ship(project: Project) {
  const video = await upload(project.demo);
  return submit({ team: "Null Pointers", video, track: "AI tools" });
}`;

export default function CodeBlockSnippet() {
  return (
    <div className="w-full max-w-2xl">
      <CodeBlock filename="ship.ts" code={code} showLineNumbers />
    </div>
  );
}

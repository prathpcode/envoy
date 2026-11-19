import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@pixel3d/ui";

export default function ResizableEditor() {
  return (
    <div className="sticker sticker-lg face-paper h-80 w-full max-w-2xl p-2">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize="30%" minSize="20%">
          <div className="flex h-full flex-col gap-2 p-5 text-lg font-semibold">
            <span className="font-extrabold">Files</span>
            <span>app.tsx</span>
            <span>voxel.ts</span>
          </div>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize="70%" minSize="30%">
          <ResizablePanelGroup orientation="vertical">
            <ResizablePanel defaultSize="65%" minSize="25%">
              <div className="grid h-full place-items-center p-5 text-xl font-extrabold">Editor</div>
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize="35%" minSize="20%">
              <div className="grid h-full place-items-center p-5 font-mono text-base">pnpm dev</div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

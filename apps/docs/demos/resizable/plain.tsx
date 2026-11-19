import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@pixel3d/ui";

export default function ResizablePlain() {
  return (
    <div className="sticker sticker-lg face-paper h-48 w-full max-w-lg p-2">
      <ResizablePanelGroup orientation="horizontal">
        <ResizablePanel defaultSize="50%">
          <div className="grid h-full place-items-center text-xl font-extrabold">Ideas</div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize="50%">
          <div className="grid h-full place-items-center text-xl font-extrabold">Shipped</div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

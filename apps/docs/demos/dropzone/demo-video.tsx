import { Dropzone } from "@pixel3d/ui";

export default function DropzoneDemoVideo() {
  return (
    <div className="w-full max-w-xl">
      <Dropzone accept="video/*" maxFiles={1}>
        Upload your demo video
      </Dropzone>
    </div>
  );
}

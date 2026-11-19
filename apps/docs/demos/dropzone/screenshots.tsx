"use client";
import * as React from "react";
import { Dropzone } from "@pixel3d/ui";

export default function DropzoneScreenshots() {
  const [count, setCount] = React.useState(0);
  return (
    <div className="w-full max-w-xl">
      <Dropzone accept="image/*" maxFiles={3} onFiles={(files) => setCount(files.length)}>
        {count < 3 ? `Drop up to ${3 - count} screenshots` : "All 3 screenshots in"}
      </Dropzone>
    </div>
  );
}

"use client";
import * as React from "react";
import { Check, Copy } from "pixelarticons/react";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from "@pixel3d/ui";

export default function InputGroupCopyLink() {
  const [copied, setCopied] = React.useState(false);
  const [slug, setSlug] = React.useState("null-pointers.dev");
  return (
    <div className="w-full max-w-md">
      <InputGroup label="Demo link">
        <InputGroupAddon>
          <InputGroupText>https://</InputGroupText>
        </InputGroupAddon>
        <InputGroupInput value={slug} onChange={(e) => setSlug(e.target.value)} />
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            size="icon-sm"
            variant={copied ? "success" : "ink"}
            aria-label={copied ? "Copied" : "Copy link"}
            onClick={() => {
              navigator.clipboard?.writeText("https://" + slug).catch(() => {});
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            }}
          >
            {copied ? <Check className="animate-land" /> : <Copy />}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}

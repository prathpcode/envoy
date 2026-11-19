"use client";
import * as React from "react";
import { Close, File, Upload } from "pixelarticons/react";
import { cn, seededUnit } from "../lib/utils";

/**
 * Dropzone — an empty sticker slot on the lid (a stepped, dotted outline). Drag files over it
 * and it peels up as a sky sticker; dropped files slap down below as small crooked file
 * stickers, each with a remove button. It's a real <button>: Enter or Space opens the picker.
 *
 *   <Dropzone accept="video/*" maxFiles={1} onFiles={setFiles}>Drop your demo video</Dropzone>
 */
export interface DropzoneProps
  extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "onDrop" | "type" | "value" | "defaultValue"> {
  /** Same syntax as <input accept>: "video/*", ".pdf,.zip", "image/png". */
  accept?: string;
  /** Most files kept at once. Default 1. */
  maxFiles?: number;
  /** Called with the full kept list whenever it changes. */
  onFiles?: (files: File[]) => void;
  /** Name for the hidden file input, for plain form posts. */
  name?: string;
}

function accepts(file: File, accept?: string) {
  if (!accept) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return accept
    .split(",")
    .map((a) => a.trim().toLowerCase())
    .filter(Boolean)
    .some((a) => (a.startsWith(".") ? name.endsWith(a) : a.endsWith("/*") ? type.startsWith(a.slice(0, -1)) : type === a));
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${Math.round(bytes / 1024)} KB`;
  if (bytes < 1024 ** 3) return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
}

const keyOf = (f: File) => `${f.name}-${f.size}-${f.lastModified}`;

export const Dropzone = React.forwardRef<HTMLButtonElement, DropzoneProps>(
  ({ accept, maxFiles = 1, onFiles, name, disabled, className, children, ...props }, ref) => {
    const input = React.useRef<HTMLInputElement>(null);
    const [files, setFiles] = React.useState<File[]>([]);
    const [over, setOver] = React.useState(false);
    const [skipped, setSkipped] = React.useState(0);
    const depth = React.useRef(0);
    const limit = Math.max(1, maxFiles);

    const commit = (next: File[]) => {
      setFiles(next);
      onFiles?.(next);
    };

    const add = (incoming: File[]) => {
      const ok = incoming.filter((f) => accepts(f, accept));
      const known = new Set(files.map(keyOf));
      const fresh = ok.filter((f) => !known.has(keyOf(f)));
      let rejected = incoming.length - ok.length;
      let next = files;
      if (limit === 1) {
        // a single slot swaps its file for the newest one
        if (fresh.length) next = [fresh[fresh.length - 1]];
        rejected += Math.max(0, fresh.length - 1);
      } else {
        const room = limit - files.length;
        next = [...files, ...fresh.slice(0, room)];
        rejected += Math.max(0, fresh.length - room);
      }
      setSkipped(rejected);
      if (next !== files) commit(next);
    };

    const remove = (f: File) => commit(files.filter((x) => x !== f));

    const full = limit > 1 && files.length >= limit;

    return (
      <div data-slot="dropzone" className="flex w-full flex-col gap-5">
        <button
          ref={ref}
          type="button"
          disabled={disabled || full}
          data-state={over ? "over" : "idle"}
          className={cn(
            "group/drop relative flex min-h-48 w-full cursor-pointer flex-col items-center justify-center gap-3 px-6 py-8 text-center font-p3d",
            "transition-[transform,filter] duration-[260ms] ease-peel outline-none",
            over
              ? "sticker sticker-lg face-sky -translate-y-1.5 scale-[1.02] [--p3d-sh:0_14px_14px_rgb(var(--p3d-shadow)/0.24)]"
              : "sticker-slot text-on-lid-soft hover:text-on-lid focus-visible:text-sky",
            "disabled:cursor-not-allowed disabled:opacity-60",
            className
          )}
          onClick={() => input.current?.click()}
          onDragEnter={(e) => {
            e.preventDefault();
            depth.current++;
            setOver(true);
          }}
          onDragOver={(e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = "copy";
          }}
          onDragLeave={() => {
            depth.current = Math.max(0, depth.current - 1);
            if (depth.current === 0) setOver(false);
          }}
          onDrop={(e) => {
            e.preventDefault();
            depth.current = 0;
            setOver(false);
            if (!disabled && !full) add([...e.dataTransfer.files]);
          }}
          {...props}
        >
          <Upload aria-hidden className={cn("pixel-icon size-8", over ? "text-ink" : "text-on-lid")} />
          <span className={cn("text-lg font-extrabold", over ? "text-ink" : "text-on-lid")}>
            {children ?? (limit > 1 ? "Drop files here" : "Drop a file here")}
          </span>
          {skipped > 0 && !over && (
            <span className="text-base font-bold text-on-lid">
              Skipped {skipped} {skipped === 1 ? "file" : "files"}
              {accept ? ` (only ${accept})` : ""}
            </span>
          )}
        </button>
        <input
          ref={input}
          type="file"
          tabIndex={-1}
          aria-hidden
          className="sr-only"
          accept={accept}
          multiple={limit > 1}
          name={name}
          onChange={(e) => {
            add([...(e.target.files ?? [])]);
            e.target.value = "";
          }}
        />
        {files.length > 0 && (
          <ul aria-label="Selected files" className="flex flex-wrap gap-4">
            {files.map((f) => (
              <li
                key={keyOf(f)}
                data-slot="dropzone-file"
                className="sticker face-paper crooked animate-slap flex h-12 max-w-full items-center gap-2 pr-1 pl-3"
                style={{ ["--p3d-tilt" as string]: `${Math.round(seededUnit(keyOf(f)) * 25) / 10}deg` }}
              >
                <File aria-hidden className="pixel-icon size-5 shrink-0" />
                <span className="min-w-0 truncate text-base font-bold">{f.name}</span>
                <span className="shrink-0 text-sm font-medium text-ink-soft tabular-nums">{formatSize(f.size)}</span>
                <button
                  type="button"
                  aria-label={`Remove ${f.name}`}
                  onClick={() => remove(f)}
                  className="ml-1 flex size-10 shrink-0 cursor-pointer items-center justify-center hover:bg-tomato focus-visible:bg-sky focus-visible:outline-none"
                >
                  <Close aria-hidden className="pixel-icon size-5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
);
Dropzone.displayName = "Dropzone";

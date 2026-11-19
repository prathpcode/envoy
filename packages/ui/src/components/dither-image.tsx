"use client";
import * as React from "react";
import { cn, useTilt, type Tilt } from "../lib/utils";

/**
 * DitherImage — any image printed like a vinyl sticker: downscaled ×3, run through a 4×4 Bayer
 * ordered dither on a 2D canvas (CPU, no WebGL) into a duotone of Ink + one ink colour, then
 * scaled back up with crisp pixels. Decorative, but it still carries an `alt`.
 *
 *   <DitherImage src="/team.jpg" alt="The team at demo day" ink="sky" />
 */
const INKS = {
  pink: "#ff3d8b",
  lime: "#b6f23a",
  sky: "#36b8ff",
  butter: "#ffd23f",
  tomato: "#ff5a36",
  paper: "#ffffff",
} as const;

export interface DitherImageProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  src: string;
  /** Describe the picture; pass "" only when it's purely decorative. */
  alt: string;
  /** The light tone of the duotone (the dark tone is always Ink). */
  ink?: keyof typeof INKS | (string & {});
  /** Downscale factor: one dither dot = `scale` CSS px. Default 3. */
  scale?: number;
  /** Print it on a crooked paper sticker. Default true. */
  frame?: boolean;
  tilt?: Tilt;
  /** Needed for cross-origin images whose server allows CORS. */
  crossOrigin?: "anonymous" | "use-credentials";
}

const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? [...h].map((c) => c + c).join("") : h;
  const n = parseInt(full.slice(0, 6), 16);
  return Number.isNaN(n) ? [255, 61, 139] : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export const DitherImage = React.forwardRef<HTMLDivElement, DitherImageProps>(
  ({ src, alt, ink = "pink", scale = 3, frame = true, tilt = "auto", crossOrigin, className, style, ...props }, ref) => {
    const box = React.useRef<HTMLDivElement>(null);
    const canvas = React.useRef<HTMLCanvasElement>(null);
    const [img, setImg] = React.useState<HTMLImageElement | null>(null);
    const [width, setWidth] = React.useState(0);
    const [failed, setFailed] = React.useState(false);
    const tiltStyle = useTilt(frame ? tilt : false);
    const light = INKS[ink as keyof typeof INKS] ?? ink;

    React.useEffect(() => {
      setImg(null);
      setFailed(false);
      const im = new Image();
      if (crossOrigin) im.crossOrigin = crossOrigin;
      im.decoding = "async";
      im.onload = () => setImg(im);
      im.onerror = () => setFailed(true);
      im.src = src;
      return () => {
        im.onload = null;
        im.onerror = null;
      };
    }, [src, crossOrigin]);

    React.useEffect(() => {
      const el = box.current;
      if (!el) return;
      const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
      ro.observe(el);
      return () => ro.disconnect();
    }, []);

    React.useEffect(() => {
      const out = canvas.current;
      if (!img || !out || width === 0) return;
      const s = Math.max(1, scale);
      const w = Math.max(1, Math.round(width / s));
      const h = Math.max(1, Math.round((w * img.naturalHeight) / Math.max(1, img.naturalWidth)));
      out.width = w;
      out.height = h;
      const ctx = out.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, w, h);
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, w, h);
      let data: ImageData;
      try {
        data = ctx.getImageData(0, 0, w, h);
      } catch {
        setFailed(true); // cross-origin image without CORS: the canvas is tainted
        return;
      }
      const [lr, lg, lb] = hexToRgb(light);
      const px = data.data;
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const i = (y * w + x) * 4;
          const lum = (0.2126 * px[i] + 0.7152 * px[i + 1] + 0.0722 * px[i + 2]) / 255;
          const on = lum > (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16;
          px[i] = on ? lr : 20;
          px[i + 1] = on ? lg : 20;
          px[i + 2] = on ? lb : 20;
          px[i + 3] = 255;
        }
      }
      ctx.putImageData(data, 0, 0);
    }, [img, width, scale, light]);

    const ratio = img ? `${img.naturalWidth} / ${img.naturalHeight}` : "4 / 3";

    return (
      <div
        ref={ref}
        data-slot="dither-image"
        role={alt ? "img" : undefined}
        aria-label={alt || undefined}
        aria-hidden={alt ? undefined : true}
        className={cn(frame && "sticker sticker-lg face-paper crooked p-3", "block w-full", className)}
        style={{ ...tiltStyle, ...style }}
        {...props}
      >
        <div ref={box} className="relative w-full bg-ink" style={{ aspectRatio: ratio }}>
          {failed ? (
            <img src={src} alt="" className="pixel-icon absolute inset-0 size-full object-cover" />
          ) : (
            <canvas ref={canvas} aria-hidden className="pixel-icon absolute inset-0 size-full" style={{ imageRendering: "pixelated" }} />
          )}
        </div>
      </div>
    );
  }
);
DitherImage.displayName = "DitherImage";

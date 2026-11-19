"use client";
import * as React from "react";
import { Toaster as Sonner, toast, type ToasterProps } from "sonner";
import { Check, Close, InfoBox, SquareAlert, WarningDiamond } from "pixelarticons/react";
import { cn } from "../lib/utils";
import { buttonVariants, PixelSpinner } from "./button";

/**
 * Toaster — toasts are crooked stickers that drop onto the lid with a stepped bounce.
 * success = lime, error = tomato, warning = butter, info = sky, default = paper.
 * Fully unstyled sonner: every pixel here is ours.
 *
 *   <Toaster />                  // once, near the root
 *   toast.success("Project submitted")
 */
export { toast };
export type { ToasterProps };

export function Toaster({
  toastOptions,
  icons,
  gap = 20,
  offset = 24,
  position = "bottom-right",
  className,
  ...props
}: ToasterProps) {
  const classNames = toastOptions?.classNames ?? {};
  return (
    <Sonner
      gap={gap}
      offset={offset}
      position={position}
      className={cn("toaster", className)}
      icons={{
        success: <Check className="pixel-icon size-6" aria-hidden />,
        error: <SquareAlert className="pixel-icon size-6" aria-hidden />,
        warning: <WarningDiamond className="pixel-icon size-6" aria-hidden />,
        info: <InfoBox className="pixel-icon size-6" aria-hidden />,
        loading: <PixelSpinner size={24} />,
        close: <Close className="pixel-icon size-4" aria-hidden />,
        ...icons,
      }}
      {...props}
      toastOptions={{
        ...toastOptions,
        unstyled: true,
        classNames: {
          ...classNames,
          toast: cn(
            "toast-sticker flex w-(--width) items-start gap-3 px-5 py-4 font-p3d text-ink",
            classNames.toast
          ),
          // sonner joins classes without merging, so each type sets its own face + tilt
          default: cn("face-paper [--p3d-tilt:-1.2deg]", classNames.default),
          success: cn("face-lime [--p3d-tilt:-2deg]", classNames.success),
          error: cn("face-tomato [--p3d-tilt:1.6deg]", classNames.error),
          warning: cn("face-butter [--p3d-tilt:-1.4deg]", classNames.warning),
          info: cn("face-sky [--p3d-tilt:1.8deg]", classNames.info),
          loading: cn("face-paper [--p3d-tilt:0.8deg]", classNames.loading),
          icon: cn("mt-0.5 grid size-6 shrink-0 place-items-center [&_svg]:pixel-icon", classNames.icon),
          content: cn("flex min-w-0 flex-1 flex-col gap-1", classNames.content),
          title: cn("text-[17px] font-extrabold leading-snug", classNames.title),
          description: cn("text-base font-medium leading-snug text-ink", classNames.description),
          actionButton: cn(buttonVariants({ variant: "ink", size: "sm" }), "shrink-0 self-center [--p3d-tilt:1.5deg]", classNames.actionButton),
          cancelButton: cn(buttonVariants({ variant: "secondary", size: "sm" }), "shrink-0 self-center", classNames.cancelButton),
          closeButton: cn(
            "sticker face-paper peel focus-cut absolute -top-3 -left-3 grid size-7 cursor-pointer place-items-center",
            classNames.closeButton
          ),
        },
      }}
    />
  );
}
Toaster.displayName = "Toaster";

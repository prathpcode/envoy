"use client";
import * as React from "react";
import { AspectRatio as AspectRatioPrimitive } from "radix-ui";

/**
 * AspectRatio — holds media to a ratio (Radix). It clips its content, so it goes
 * *inside* a sticker, never on the sticker element itself.
 */
export const AspectRatio = React.forwardRef<
  React.ComponentRef<typeof AspectRatioPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AspectRatioPrimitive.Root>
>((props, ref) => <AspectRatioPrimitive.Root ref={ref} data-slot="aspect-ratio" {...props} />);
AspectRatio.displayName = "AspectRatio";

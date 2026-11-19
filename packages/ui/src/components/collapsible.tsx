"use client";
import * as React from "react";
import { Collapsible as CollapsiblePrimitive } from "radix-ui";
import { cn } from "../lib/utils";

/**
 * Collapsible — a thin wrapper over Radix Collapsible. The content hinges open from its
 * top edge with the same unfold motion as Accordion. Bring your own trigger (a Button).
 */
export const Collapsible = React.forwardRef<
  React.ComponentRef<typeof CollapsiblePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Root>
>((props, ref) => <CollapsiblePrimitive.Root ref={ref} data-slot="collapsible" {...props} />);
Collapsible.displayName = "Collapsible";

export const CollapsibleTrigger = React.forwardRef<
  React.ComponentRef<typeof CollapsiblePrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Trigger>
>((props, ref) => <CollapsiblePrimitive.Trigger ref={ref} data-slot="collapsible-trigger" {...props} />);
CollapsibleTrigger.displayName = "CollapsibleTrigger";

export const CollapsibleContent = React.forwardRef<
  React.ComponentRef<typeof CollapsiblePrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.Content>
>(({ className, ...props }, ref) => (
  <CollapsiblePrimitive.Content
    ref={ref}
    data-slot="collapsible-content"
    className={cn("unfold-motion unfold-collapsible", className)}
    {...props}
  />
));
CollapsibleContent.displayName = "CollapsibleContent";

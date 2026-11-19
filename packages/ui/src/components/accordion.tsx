"use client";
import * as React from "react";
import { Accordion as AccordionPrimitive } from "radix-ui";
import { ChevronDown } from "pixelarticons/react";
import { cn } from "../lib/utils";

/**
 * Accordion — a stack of straight paper stickers. Opening one hinges its content open
 * from the top edge (a little 3D rotateX + height), and the pixel chevron turns in steps.
 */
export const Accordion = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Root
    ref={ref}
    data-slot="accordion"
    className={cn("flex w-full flex-col gap-4", className)}
    {...props}
  />
));
Accordion.displayName = "Accordion";

export const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    data-slot="accordion-item"
    className={cn("sticker sticker-disabled focus-within-cut face-paper", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

export const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header data-slot="accordion-header" className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      data-slot="accordion-trigger"
      className={cn(
        "group/acc flex min-h-14 flex-1 cursor-pointer items-center justify-between gap-4 px-5 py-3 text-left text-lg font-extrabold leading-snug outline-none disabled:cursor-not-allowed",
        "[&_svg]:pixel-icon",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        aria-hidden
        className="size-6 shrink-0 transition-transform duration-[280ms] ease-[steps(4,end)] group-data-[state=open]/acc:rotate-180"
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "AccordionTrigger";

export const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    data-slot="accordion-content"
    className="unfold-motion unfold-accordion"
    {...props}
  >
    <div className={cn("px-5 pb-5 text-base leading-relaxed text-ink-soft", className)}>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "AccordionContent";

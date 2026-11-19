import * as React from "react";
import { cn } from "../lib/utils";

/**
 * Empty — an empty state laid straight on the bare lid: no sticker frame, the quiet
 * field is the design. The media slot is sized for a <Sticker3D> or <PatternSVG>.
 * Few Voices: one heading, one line, one action.
 *
 *   <Empty>
 *     <EmptyMedia><Sticker3D pattern="ghost" /></EmptyMedia>
 *     <EmptyTitle>No projects yet</EmptyTitle>
 *     <EmptyDescription>Start one and it lands here.</EmptyDescription>
 *     <EmptyActions><Button>New project</Button></EmptyActions>
 *   </Empty>
 */
export const Empty = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="empty"
      className={cn("flex w-full flex-col items-center justify-center gap-4 px-6 py-12 text-center text-on-lid", className)}
      {...props}
    />
  )
);
Empty.displayName = "Empty";

/** Optional wrapper for title + description (shadcn parity). */
export const EmptyHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="empty-header" className={cn("flex flex-col items-center gap-3", className)} {...props} />
  )
);
EmptyHeader.displayName = "EmptyHeader";

export const EmptyMedia = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="empty-media"
      className={cn("mb-2 flex size-44 items-center justify-center [&>*]:size-full", className)}
      {...props}
    />
  )
);
EmptyMedia.displayName = "EmptyMedia";

export const EmptyTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      data-slot="empty-title"
      className={cn("text-3xl font-extrabold leading-tight tracking-[-0.02em]", className)}
      {...props}
    />
  )
);
EmptyTitle.displayName = "EmptyTitle";

export const EmptyDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      data-slot="empty-description"
      className={cn("max-w-[42ch] text-lg leading-relaxed text-on-lid-soft", className)}
      {...props}
    />
  )
);
EmptyDescription.displayName = "EmptyDescription";

export const EmptyActions = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      data-slot="empty-actions"
      className={cn("mt-4 flex flex-wrap items-center justify-center gap-4", className)}
      {...props}
    />
  )
);
EmptyActions.displayName = "EmptyActions";

/** Alias of EmptyActions for shadcn parity. */
export const EmptyContent = EmptyActions;

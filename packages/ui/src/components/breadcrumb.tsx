import * as React from "react";
import { Slot } from "radix-ui";
import { ChevronRight, MoreHorizontal } from "pixelarticons/react";
import { cn } from "../lib/utils";

/**
 * Breadcrumb — ink links with a pink underline, pixel chevron separators, and the
 * current page stuck on as a small crooked pink sticker. Same API as shadcn.
 */
export const Breadcrumb = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<"nav">>(
  ({ "aria-label": label = "Breadcrumb", ...props }, ref) => (
    <nav ref={ref} aria-label={label} data-slot="breadcrumb" {...props} />
  )
);
Breadcrumb.displayName = "Breadcrumb";

export const BreadcrumbList = React.forwardRef<HTMLOListElement, React.ComponentPropsWithoutRef<"ol">>(
  ({ className, ...props }, ref) => (
    <ol
      ref={ref}
      data-slot="breadcrumb-list"
      className={cn("flex flex-wrap items-center gap-x-2 gap-y-3 text-base text-on-lid", className)}
      {...props}
    />
  )
);
BreadcrumbList.displayName = "BreadcrumbList";

export const BreadcrumbItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
  ({ className, ...props }, ref) => (
    <li ref={ref} data-slot="breadcrumb-item" className={cn("inline-flex items-center gap-2", className)} {...props} />
  )
);
BreadcrumbItem.displayName = "BreadcrumbItem";

export const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<"a"> & { asChild?: boolean }
>(({ asChild, className, ...props }, ref) => {
  const Comp = asChild ? Slot.Root : "a";
  return (
    <Comp
      ref={ref}
      data-slot="breadcrumb-link"
      className={cn(
        "font-semibold text-on-lid underline decoration-pink decoration-[3px] underline-offset-[5px] transition-colors hover:bg-pink hover:text-ink",
        className
      )}
      {...props}
    />
  );
});
BreadcrumbLink.displayName = "BreadcrumbLink";

export const BreadcrumbPage = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span"> & { tilt?: number }
>(({ className, tilt = -2, style, ...props }, ref) => (
  <span
    ref={ref}
    data-slot="breadcrumb-page"
    role="link"
    aria-disabled="true"
    aria-current="page"
    style={{ ["--p3d-tilt" as string]: `${tilt}deg`, ...style }}
    className={cn("sticker crooked face-pink mx-1 inline-flex h-9 items-center px-3 font-extrabold", className)}
    {...props}
  />
));
BreadcrumbPage.displayName = "BreadcrumbPage";

export const BreadcrumbSeparator = ({ children, className, ...props }: React.ComponentProps<"li">) => (
  <li
    data-slot="breadcrumb-separator"
    role="presentation"
    aria-hidden="true"
    className={cn("inline-flex text-on-lid-soft [&_svg]:pixel-icon [&_svg]:size-4", className)}
    {...props}
  >
    {children ?? <ChevronRight />}
  </li>
);
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

export const BreadcrumbEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    data-slot="breadcrumb-ellipsis"
    role="presentation"
    aria-hidden="true"
    className={cn("inline-flex size-9 items-center justify-center text-on-lid-soft", className)}
    {...props}
  >
    <MoreHorizontal className="pixel-icon size-6" />
    <span className="sr-only">More</span>
  </span>
);
BreadcrumbEllipsis.displayName = "BreadcrumbEllipsis";

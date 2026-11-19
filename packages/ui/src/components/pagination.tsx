"use client";
import * as React from "react";
import { ArrowLeft, ArrowRight, MoreHorizontal } from "pixelarticons/react";
import { cn, useTilt } from "../lib/utils";

/**
 * Pagination — every page is a small square paper sticker that peels; the current page
 * is lime, straight and pressed flat. Prev/next carry pixel arrows. Same API as shadcn.
 */
export const Pagination = ({ className, ...props }: React.ComponentProps<"nav">) => (
  <nav
    role="navigation"
    aria-label="Pagination"
    data-slot="pagination"
    className={cn("mx-auto flex w-full justify-center", className)}
    {...props}
  />
);
Pagination.displayName = "Pagination";

export const PaginationContent = React.forwardRef<HTMLUListElement, React.ComponentProps<"ul">>(
  ({ className, ...props }, ref) => (
    <ul
      ref={ref}
      data-slot="pagination-content"
      className={cn("flex flex-wrap items-center gap-3", className)}
      {...props}
    />
  )
);
PaginationContent.displayName = "PaginationContent";

export const PaginationItem = React.forwardRef<HTMLLIElement, React.ComponentProps<"li">>((props, ref) => (
  <li ref={ref} data-slot="pagination-item" {...props} />
));
PaginationItem.displayName = "PaginationItem";

export type PaginationLinkProps = {
  isActive?: boolean;
  size?: "icon" | "default";
} & React.ComponentProps<"a">;

export const PaginationLink = ({ className, isActive, size = "icon", style, ...props }: PaginationLinkProps) => {
  const tilt = useTilt(isActive ? false : "auto", 2);
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive || undefined}
      style={{ ...tilt, ...style }}
      className={cn(
        "sticker sticker-disabled focus-cut inline-flex h-11 cursor-pointer select-none items-center justify-center gap-2 text-[17px] font-extrabold tabular-nums [&_svg]:pixel-icon [&_svg]:size-5",
        size === "icon" ? "w-11" : "px-4",
        isActive ? "face-lime sticker-flat" : "face-paper peel",
        className
      )}
      {...props}
    />
  );
};
PaginationLink.displayName = "PaginationLink";

export const PaginationPrevious = ({ className, children, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label={children ? undefined : "Go to previous page"} size="default" className={className} {...props}>
    <ArrowLeft aria-hidden />
    <span className="max-sm:sr-only">{children ?? "Prev"}</span>
  </PaginationLink>
);
PaginationPrevious.displayName = "PaginationPrevious";

export const PaginationNext = ({ className, children, ...props }: React.ComponentProps<typeof PaginationLink>) => (
  <PaginationLink aria-label={children ? undefined : "Go to next page"} size="default" className={className} {...props}>
    <span className="max-sm:sr-only">{children ?? "Next"}</span>
    <ArrowRight aria-hidden />
  </PaginationLink>
);
PaginationNext.displayName = "PaginationNext";

export const PaginationEllipsis = ({ className, ...props }: React.ComponentProps<"span">) => (
  <span
    aria-hidden
    data-slot="pagination-ellipsis"
    className={cn("flex size-11 items-center justify-center text-on-lid-soft", className)}
    {...props}
  >
    <MoreHorizontal className="pixel-icon size-6" />
    <span className="sr-only">More pages</span>
  </span>
);
PaginationEllipsis.displayName = "PaginationEllipsis";

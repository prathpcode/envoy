import * as React from "react";
import { Slot } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

/**
 * Item — a list row as a straight paper sticker: media, a title, one line, actions.
 * As a link (`asChild` with an <a>) it lifts gently on hover. Same parts as shadcn Item.
 */
export const itemVariants = cva(
  "group/item sticker focus-within-cut flex w-full items-center gap-4 text-left",
  {
    variants: {
      variant: {
        paper: "face-paper",
        lid: "face-lid",
        flat: "face-paper sticker-flat",
      },
      size: {
        default: "min-h-18 px-5 py-4",
        sm: "min-h-14 px-4 py-3 gap-3",
      },
    },
    defaultVariants: { variant: "paper", size: "default" },
  }
);

export interface ItemProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof itemVariants> {
  asChild?: boolean;
}

export const Item = React.forwardRef<HTMLDivElement, ItemProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot.Root : "div";
    return (
      <Comp
        ref={ref}
        data-slot="item"
        className={cn(
          itemVariants({ variant, size }),
          "[a&]:cursor-pointer [a&]:outline-none [a&]:transition-[transform,filter] [a&]:duration-[260ms] [a&]:ease-peel",
          "[a&]:hover:-translate-y-1 [a&]:hover:[--p3d-sh:0_12px_12px_rgb(var(--p3d-shadow)/0.22)] [a&]:active:translate-y-0 [a&]:active:[--p3d-sh:0_2px_2px_rgb(var(--p3d-shadow)/0.3)]",
          className
        )}
        {...props}
      />
    );
  }
);
Item.displayName = "Item";

export const ItemGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} role="list" data-slot="item-group" className={cn("flex w-full flex-col gap-4", className)} {...props} />
  )
);
ItemGroup.displayName = "ItemGroup";

const itemMediaVariants = cva("flex shrink-0 items-center justify-center", {
  variants: {
    variant: {
      default: "",
      icon: "size-12 bg-lid-deep/60 text-ink [&_svg]:pixel-icon [&_svg]:size-6",
      image: "size-12 overflow-hidden bg-lid-deep/60 [&_img]:size-full [&_img]:object-cover",
    },
  },
  defaultVariants: { variant: "default" },
});

export const ItemMedia = ({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof itemMediaVariants>) => (
  <div data-slot="item-media" className={cn(itemMediaVariants({ variant }), className)} {...props} />
);

export const ItemContent = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="item-content" className={cn("flex min-w-0 flex-1 flex-col gap-0.5", className)} {...p} />
);

export const ItemTitle = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    data-slot="item-title"
    className={cn("flex items-center gap-2 text-lg font-extrabold leading-snug tracking-[-0.01em]", className)}
    {...p}
  />
);

export const ItemDescription = ({ className, ...p }: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    data-slot="item-description"
    className={cn("line-clamp-2 text-base leading-normal opacity-80", className)}
    {...p}
  />
);

export const ItemActions = ({ className, ...p }: React.HTMLAttributes<HTMLDivElement>) => (
  <div data-slot="item-actions" className={cn("flex shrink-0 items-center gap-3", className)} {...p} />
);

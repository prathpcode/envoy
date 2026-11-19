"use client";
import * as React from "react";
import { Avatar as AvatarPrimitive } from "radix-ui";
import { cva, type VariantProps } from "class-variance-authority";
import { cn, seededUnit, useTilt, type Tilt } from "../lib/utils";

/**
 * Avatar — a small square sticker, a little crooked, with the photo printed on it.
 * Without a photo the fallback shows initials on an ink face picked from the name,
 * so the same team always gets the same colour. AvatarGroup overlaps them with
 * alternating tilts, like a stack slapped on a lid.
 *
 *   <Avatar><AvatarImage src="/ada.png" alt="Ada" /><AvatarFallback>Ada Lovelace</AvatarFallback></Avatar>
 */
export const avatarVariants = cva("sticker crooked relative inline-flex shrink-0 select-none", {
  variants: {
    size: {
      sm: "size-10 text-sm",
      md: "size-12 text-base",
      lg: "size-16 text-xl",
      xl: "size-24 text-3xl",
    },
  },
  defaultVariants: { size: "md" },
});

export interface AvatarProps
  extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>,
    VariantProps<typeof avatarVariants> {
  /** Resting angle. "auto" (default) picks a stable crooked angle; false = straight. */
  tilt?: Tilt;
}

/** Set by AvatarGroup: members take the group's size and its alternating tilts. */
const AvatarGroupContext = React.createContext<{ size?: AvatarProps["size"] } | null>(null);

export const Avatar = React.forwardRef<React.ComponentRef<typeof AvatarPrimitive.Root>, AvatarProps>(
  ({ className, size, tilt, style, ...props }, ref) => {
    const group = React.useContext(AvatarGroupContext);
    const tiltStyle = useTilt(tilt ?? "auto");
    // inside a group the tilt comes from the group's nth-child rules unless set explicitly
    const ownTilt = group && tilt === undefined ? undefined : tiltStyle;
    return (
      <AvatarPrimitive.Root
        ref={ref}
        data-slot="avatar"
        className={cn(avatarVariants({ size: size ?? group?.size }), "face-paper", className)}
        style={{ ...ownTilt, ...style }}
        {...props}
      />
    );
  }
);
Avatar.displayName = "Avatar";

export const AvatarImage = React.forwardRef<
  React.ComponentRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    data-slot="avatar-image"
    className={cn("pixel-notch absolute inset-0 size-full object-cover", className)}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

const fallbackFaces = ["bg-pink", "bg-lime", "bg-sky", "bg-butter"] as const;

/** Two initials from a name: "Null Pointers" -> "NP", "ada" -> "AD". */
export function getInitials(name: string) {
  const words = name.trim().split(/[\s_-]+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0]!.slice(0, 2).toUpperCase();
  return (words[0]![0]! + words[words.length - 1]![0]!).toUpperCase();
}

/** The fallback ink a name always gets (pink / lime / sky / butter). */
export function getAvatarInk(name: string) {
  const i = Math.floor(((seededUnit(name) + 1) / 2) * fallbackFaces.length) % fallbackFaces.length;
  return fallbackFaces[i]!;
}

export interface AvatarFallbackProps extends React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback> {
  /** The person or team name. Picks the face colour and the initials. Defaults to the text children. */
  name?: string;
}

export const AvatarFallback = React.forwardRef<React.ComponentRef<typeof AvatarPrimitive.Fallback>, AvatarFallbackProps>(
  ({ className, name, children, ...props }, ref) => {
    const source = name ?? (typeof children === "string" ? children : "");
    // a full name in children becomes initials; short custom text ("AL") is kept as-is
    const content =
      typeof children === "string" && children.trim().length > 2 ? getInitials(children) : (children ?? getInitials(source));
    return (
      <AvatarPrimitive.Fallback
        ref={ref}
        data-slot="avatar-fallback"
        role={source ? "img" : undefined}
        aria-label={source || undefined}
        className={cn(
          "pixel-notch absolute inset-0 grid place-items-center font-extrabold leading-none tracking-[-0.02em] text-ink",
          getAvatarInk(source || "?"),
          className
        )}
        {...props}
      >
        {content}
      </AvatarPrimitive.Fallback>
    );
  }
);
AvatarFallback.displayName = "AvatarFallback";

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show at most this many; the rest collapse into a "+n" sticker. */
  max?: number;
  size?: VariantProps<typeof avatarVariants>["size"];
}

export const AvatarGroup = React.forwardRef<HTMLDivElement, AvatarGroupProps>(
  ({ className, children, max, size, ...props }, ref) => {
    const items = React.Children.toArray(children);
    const shown = max != null ? items.slice(0, max) : items;
    const extra = items.length - shown.length;
    return (
      <AvatarGroupContext.Provider value={{ size }}>
        <div
          ref={ref}
          data-slot="avatar-group"
          role="group"
          className={cn(
            "flex items-center pl-2 [&>*]:-ml-2",
            "[&>*:nth-child(4n+1)]:[--p3d-tilt:-2.5deg] [&>*:nth-child(4n+2)]:[--p3d-tilt:2deg]",
            "[&>*:nth-child(4n+3)]:[--p3d-tilt:-1.5deg] [&>*:nth-child(4n+4)]:[--p3d-tilt:2.5deg]",
            className
          )}
          {...props}
        >
          {shown}
          {extra > 0 && (
            <span
              data-slot="avatar-overflow"
              role="img"
              aria-label={`${extra} more`}
              className={cn(avatarVariants({ size }), "face-ink items-center justify-center font-extrabold")}
            >
              +{extra}
            </span>
          )}
        </div>
      </AvatarGroupContext.Provider>
    );
  }
);
AvatarGroup.displayName = "AvatarGroup";

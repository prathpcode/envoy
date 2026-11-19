"use client";
import * as React from "react";
import { OTPInput, OTPInputContext } from "input-otp";
import { Minus } from "pixelarticons/react";
import { cn, useChanged } from "../lib/utils";

export { REGEXP_ONLY_DIGITS, REGEXP_ONLY_CHARS, REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

/**
 * InputOTP — every slot is a square paper sticker. The active slot's kiss-cut turns sky with a
 * pink block caret; each filled slot slaps down. Built on `input-otp` (shadcn API).
 *
 *   <InputOTP maxLength={6}><InputOTPGroup><InputOTPSlot index={0} />…</InputOTPGroup></InputOTP>
 */
export const InputOTP = React.forwardRef<
  React.ComponentRef<typeof OTPInput>,
  React.ComponentPropsWithoutRef<typeof OTPInput>
>(({ className, containerClassName, ...props }, ref) => (
  <OTPInput
    ref={ref}
    data-slot="input-otp"
    containerClassName={cn("flex items-center gap-3 has-[:disabled]:opacity-60", containerClassName)}
    className={cn("disabled:cursor-not-allowed", className)}
    {...props}
  />
));
InputOTP.displayName = "InputOTP";

export const InputOTPGroup = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} data-slot="input-otp-group" className={cn("flex items-center gap-2 sm:gap-3", className)} {...props} />
  )
);
InputOTPGroup.displayName = "InputOTPGroup";

export const InputOTPSlot = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<"div"> & { index: number }
>(({ index, className, ...props }, ref) => {
  const ctx = React.useContext(OTPInputContext);
  const slot = ctx?.slots[index];
  const char = slot?.char ?? null;
  const isActive = slot?.isActive ?? false;
  const hasFakeCaret = slot?.hasFakeCaret ?? false;
  const typed = useChanged(char); // a prefilled code doesn't slap on load
  return (
    <div
      ref={ref}
      data-slot="input-otp-slot"
      data-active={isActive || undefined}
      data-filled={char ? true : undefined}
      className={cn("relative size-11 shrink-0 sm:size-14", className)}
      {...props}
    >
      {/* keyed so a fresh character remounts the sticker and it slaps down */}
      <div
        key={char ? `f-${char}` : "empty"}
        className={cn(
          "sticker face-paper absolute inset-0 grid place-items-center text-[28px] font-extrabold leading-none tabular-nums text-ink",
          isActive && "[--p3d-cut:var(--color-sky)]",
          char && typed && "animate-slap"
        )}
      >
        {char}
        {hasFakeCaret && (
          <span aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
            <span className="h-8 w-3 bg-pink animate-caret-blink" />
          </span>
        )}
      </div>
    </div>
  );
});
InputOTPSlot.displayName = "InputOTPSlot";

export const InputOTPSeparator = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      role="separator"
      data-slot="input-otp-separator"
      className={cn("flex text-on-lid-soft", className)}
      {...props}
    >
      <Minus className="pixel-icon size-6" aria-hidden />
    </div>
  )
);
InputOTPSeparator.displayName = "InputOTPSeparator";

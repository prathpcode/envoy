"use client";
import * as React from "react";
import { RadioGroup as RadioGroupPrimitive } from "radix-ui";
import { Check } from "pixelarticons/react";
import { cn, useTilt, type Tilt } from "../lib/utils";

/**
 * RadioGroup — each radio is a small square paper sticker. Choosing one lands a lime
 * pixel dot-sticker inside; the one you left peels its dot back off.
 * `variant="cards"` turns every option into a full sticker tile that goes lime and lies flat
 * when chosen (pick your track, pick your plan).
 */
type RadioVariant = "default" | "cards";

const RadioGroupContext = React.createContext<{ variant: RadioVariant; leaving?: string; changed: boolean }>({
  variant: "default",
  changed: false,
});

export interface RadioGroupProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
  variant?: RadioVariant;
}

export const RadioGroup = React.forwardRef<React.ComponentRef<typeof RadioGroupPrimitive.Root>, RadioGroupProps>(
  ({ className, variant = "default", onValueChange, ...props }, ref) => {
    // only the radio you just left peels its dot off; the rest stay blank (no flash on first paint)
    const current = React.useRef<string | undefined>(props.value ?? props.defaultValue ?? undefined);
    if (props.value !== undefined) current.current = props.value ?? undefined;
    const [leaving, setLeaving] = React.useState<string | undefined>();
    // the default choice is simply there on load; dots land only once the user chooses
    const [changed, setChanged] = React.useState(false);
    const ctx = React.useMemo(() => ({ variant, leaving, changed }), [variant, leaving, changed]);
    return (
      <RadioGroupContext.Provider value={ctx}>
        <RadioGroupPrimitive.Root
          ref={ref}
          data-slot="radio-group"
          data-variant={variant}
          onValueChange={(v) => {
            setLeaving(current.current);
            setChanged(true);
            current.current = v;
            onValueChange?.(v);
          }}
          className={cn(variant === "cards" ? "grid gap-5" : "grid gap-4", className)}
          {...props}
        />
      </RadioGroupContext.Provider>
    );
  }
);
RadioGroup.displayName = "RadioGroup";

export interface RadioGroupItemProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
  /** Cards only: resting angle. "auto" (default) picks a stable crooked angle; false = straight. */
  tilt?: Tilt;
}

export const RadioGroupItem = React.forwardRef<React.ComponentRef<typeof RadioGroupPrimitive.Item>, RadioGroupItemProps>(
  ({ className, tilt = "auto", style, children, ...props }, ref) => {
    const { variant, leaving, changed } = React.useContext(RadioGroupContext);
    const tiltStyle = useTilt(variant === "cards" ? tilt : false);

    if (variant === "cards") {
      return (
        <RadioGroupPrimitive.Item
          ref={ref}
          data-slot="radio-group-item"
          data-variant="cards"
          style={{ ...tiltStyle, ...style }}
          className={cn(
            "sticker sticker-lg sticker-disabled focus-cut peel face-paper relative flex min-h-24 w-full cursor-pointer flex-col items-start gap-1 p-5 pr-14 text-left",
            "data-[state=checked]:face-lime data-[state=checked]:sticker-flat data-[state=checked]:[--p3d-tilt:0deg]",
            "[&_svg]:pixel-icon",
            className
          )}
          {...props}
        >
          {children}
          <RadioGroupPrimitive.Indicator
            data-slot="radio-group-indicator"
            className={cn("sticker face-ink absolute top-4 right-4 grid size-7 place-items-center", changed && "animate-land")}
          >
            <Check className="pixel-icon size-5" aria-hidden />
          </RadioGroupPrimitive.Indicator>
        </RadioGroupPrimitive.Item>
      );
    }

    return (
      <RadioGroupPrimitive.Item
        ref={ref}
        data-slot="radio-group-item"
        style={style}
        className={cn(
          "peer sticker sticker-disabled focus-cut face-paper grid size-9 shrink-0 cursor-pointer place-items-center",
          className
        )}
        {...props}
      >
        <RadioGroupPrimitive.Indicator
          forceMount
          data-slot="radio-group-indicator"
          className={cn(
            "grid size-5 place-items-center [transform:rotate(-4deg)]",
            changed && "data-[state=checked]:animate-land",
            leaving === props.value ? "data-[state=unchecked]:animate-peel-off" : "data-[state=unchecked]:opacity-0"
          )}
        >
          {/* the pixel dot: a lime stepped blob with an ink core */}
          <span
            aria-hidden
            className="grid size-3 place-items-center bg-lime shadow-[0_-4px_0_var(--color-lime),0_4px_0_var(--color-lime),-4px_0_0_var(--color-lime),4px_0_0_var(--color-lime)]"
          >
            <span className="size-2 bg-ink" />
          </span>
        </RadioGroupPrimitive.Indicator>
        {children}
      </RadioGroupPrimitive.Item>
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

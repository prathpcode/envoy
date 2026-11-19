"use client";
import * as React from "react";
import { Check } from "pixelarticons/react";
import { cn } from "../lib/utils";

/**
 * Stepper — progress through a short flow. Each step is a square sticker: done = lime with a
 * check that lands, current = pink, upcoming = paper. Connectors are pixel-dotted rules.
 * Straight, never crooked: it's structure.
 *
 *   <Stepper steps={["Team", "Project", "Demo"]} current={1} />
 */
export interface StepperStep {
  id?: string;
  title: React.ReactNode;
}

export interface StepperProps extends Omit<React.HTMLAttributes<HTMLOListElement>, "children"> {
  steps: (StepperStep | string)[];
  /** Index of the current step. Steps before it are done; `steps.length` = all done. */
  current: number;
  orientation?: "horizontal" | "vertical";
}

export const Stepper = React.forwardRef<HTMLOListElement, StepperProps>(
  ({ steps, current, orientation = "horizontal", className, ...props }, ref) => {
    // steps already done when the page loads are just done; only steps you finish land
    const doneAtMount = React.useRef(current).current;
    const vertical = orientation === "vertical";
    return (
      <ol
        ref={ref}
        data-slot="stepper"
        data-orientation={orientation}
        className={cn("flex w-full", vertical ? "flex-col" : "items-start", className)}
        {...props}
      >
        {steps.map((raw, i) => {
          const step = typeof raw === "string" ? { title: raw } : raw;
          const state = i < current ? "done" : i === current ? "current" : "upcoming";
          const last = i === steps.length - 1;
          return (
            <li
              key={step.id ?? i}
              data-slot="stepper-step"
              data-state={state}
              aria-current={state === "current" ? "step" : undefined}
              className={cn(
                "relative flex",
                vertical ? "min-h-24 gap-4" : "min-w-0 flex-1 flex-col items-center gap-3 text-center break-words",
                last && vertical && "min-h-0"
              )}
            >
              <div className={cn("flex items-center", vertical ? "flex-col self-stretch" : "w-full")}>
                {!vertical && <Connector hidden={i === 0} done={i <= current} />}
                <span
                  aria-hidden
                  className={cn(
                    "sticker flex size-12 shrink-0 items-center justify-center text-lg font-extrabold tabular-nums",
                    state === "done" && "face-lime",
                    state === "current" && "face-pink",
                    state === "upcoming" && "face-paper"
                  )}
                >
                  {state === "done" ? (
                    <Check key="check" className={cn("pixel-icon size-6", i >= doneAtMount && "animate-land")} />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                </span>
                {!vertical && <Connector hidden={last} done={i < current} />}
                {vertical && !last && <Connector vertical done={i < current} />}
              </div>
              <span
                className={cn(
                  "text-base font-bold leading-snug",
                  vertical && "pt-3",
                  state === "upcoming" ? "text-on-lid-soft" : "text-on-lid"
                )}
              >
                {step.title}
                <span className="sr-only">
                  {state === "done" ? ", done" : state === "current" ? ", current step" : ""}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    );
  }
);
Stepper.displayName = "Stepper";

/** A pixel-dotted rule between steps: solid ink dots once you've passed it. */
function Connector({ vertical, done, hidden }: { vertical?: boolean; done: boolean; hidden?: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        done ? "text-on-lid" : "text-on-lid-soft opacity-60",
        vertical ? "my-3 w-1 flex-1" : "mx-3 h-1 min-w-4 flex-1",
        hidden && "invisible"
      )}
      style={{
        backgroundImage: `linear-gradient(${vertical ? "180deg" : "90deg"}, currentColor 50%, transparent 50%)`,
        backgroundSize: vertical ? "4px 8px" : "8px 4px",
      }}
    />
  );
}

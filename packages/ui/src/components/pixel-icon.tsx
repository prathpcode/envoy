import * as React from "react";
import { cn } from "../lib/utils";

/**
 * Wrapper for pixelarticons (MIT) components. Renders crisp on the pixel grid.
 *
 *   import { Heart } from "pixelarticons/react";
 *   <PixelIcon icon={Heart} size={24} />
 */
export type PixelIconComponent = (props: React.SVGProps<SVGSVGElement>) => React.JSX.Element;

export interface PixelIconProps extends Omit<React.SVGProps<SVGSVGElement>, "ref"> {
  icon: PixelIconComponent;
  size?: 16 | 24 | 32 | 48;
  label?: string;
}

export function PixelIcon({ icon: Icon, size = 24, label, className, ...props }: PixelIconProps) {
  return (
    <Icon
      width={size}
      height={size}
      aria-hidden={label ? undefined : true}
      aria-label={label}
      role={label ? "img" : undefined}
      className={cn("pixel-icon", className)}
      {...props}
    />
  );
}

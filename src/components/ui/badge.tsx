import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { getContrastTextColor } from "@/lib/contrast-utils";
import { useAppConfig } from "@/contexts/AppConfigContext";
import { hexToHSL } from "@/lib/color-utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, style, ...props }: BadgeProps) {
  const { config } = useAppConfig();
  let dynamicClass = className;
  let dynamicStyle = style ?? {};

  // Aplica contraste acessível apenas no hover para badges principais
  if (variant === "default" && config?.primaryColor) {
    const hsl = hexToHSL(config.primaryColor);
    const textColor = getContrastTextColor(hsl);
    dynamicClass = cn(className, "hover:text-[var(--contrast-primary)]");
    dynamicStyle = {
      ...dynamicStyle,
      ["--contrast-primary"]: textColor,
    } as React.CSSProperties;
  }
  if (variant === "secondary" && config?.secondaryColor) {
    const hsl = hexToHSL(config.secondaryColor);
    const textColor = getContrastTextColor(hsl);
    dynamicClass = cn(className, "hover:text-[var(--contrast-secondary)]");
    dynamicStyle = {
      ...dynamicStyle,
      ["--contrast-secondary"]: textColor,
    } as React.CSSProperties;
  }

  return (
    <div
      className={cn(badgeVariants({ variant }), dynamicClass)}
      style={dynamicStyle}
      {...props}
    />
  );
}

export { Badge };

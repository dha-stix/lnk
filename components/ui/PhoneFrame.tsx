import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

type PhoneFrameProps = {
  children: ReactNode;
  width?: number;
  height?: number;
  shadow?: "lime" | "ink" | "none";
  className?: string;
  style?: CSSProperties;
};

const SHADOWS = { lime: "shadow-lime", ink: "shadow-brutal-lg", none: "" };

export function PhoneFrame({ children, width = 300, height = 600, shadow = "lime", className, style }: PhoneFrameProps) {
  return (
    <div
      className={cn("relative overflow-hidden rounded-[44px] border-8 border-ink bg-white", SHADOWS[shadow], className)}
      style={{ width, height, ...style }}
    >
      <div className="h-full overflow-y-auto overscroll-contain [scrollbar-width:none]">{children}</div>
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";

type ToggleProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  size?: "sm" | "md";
  disabled?: boolean;
};

export function Toggle({ checked, onChange, label, size = "md", disabled }: ToggleProps) {
  const track = size === "sm" ? "h-6 w-11" : "h-8 w-14";
  const knob = size === "sm" ? "size-4.5 top-0.75" : "size-6 top-1";
  const shift = size === "sm" ? "translate-x-5.5" : "translate-x-7";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative shrink-0 rounded-full border-2 border-ink transition-colors duration-300 disabled:opacity-50",
        track,
        checked ? "bg-violet" : "bg-line-strong",
      )}
    >
      <span
        className={cn(
          "absolute left-0.5 rounded-full bg-white shadow transition-transform duration-300 ease-[cubic-bezier(.34,1.56,.64,1)]",
          knob,
          checked && shift,
        )}
      />
    </button>
  );
}

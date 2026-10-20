"use client";

import { useCountUp, useInView } from "@/lib/hooks";
import { formatCompact, formatNumber } from "@/lib/utils";

type CountUpProps = {
  value: number;
  compact?: boolean;
  suffix?: string;
  decimals?: number;
  className?: string;
};

/** Counts up to `value` when it scrolls into view, and again when it changes. */
export function CountUp({ value, compact, suffix = "", decimals = 0, className }: CountUpProps) {
  const [ref, inView] = useInView<HTMLSpanElement>();
  const current = useCountUp(value, inView);
  const text = decimals ? current.toFixed(decimals) : compact ? formatCompact(current) : formatNumber(current);
  return (
    <span ref={ref} className={className} aria-label={`${decimals ? value.toFixed(decimals) : formatNumber(value)}${suffix}`}>
      <span aria-hidden>
        {text}
        {suffix}
      </span>
    </span>
  );
}

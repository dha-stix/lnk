import { cn } from "@/lib/utils";

/** Stroke icons (24×24). Dots are zero-length strokes with round caps. */
const ICONS = {
  links: "M10 13a5 5 0 0 0 7.07 0l3-3a5 5 0 0 0-7.07-7.07l-1.5 1.5M14 11a5 5 0 0 0-7.07 0l-3 3a5 5 0 0 0 7.07 7.07l1.5-1.5",
  palette: "M12 3a9 9 0 1 0 0 18c1.1 0 1.5-.9 1.5-1.6 0-.8-.6-1.4-.6-2.2 0-.9.7-1.6 1.6-1.6H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3zM7.5 11h.01M10 7.5h.01M14.5 7.5h.01",
  chart: "M4 20V11M10 20V5M16 20v-7M2 20h20",
  settings: "M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1M15 4v4M9 10v4M17 16v4",
  copy: "M9 9h11v11H9zM5 15H4V4h11v1",
  external: "M14 4h6v6M20 4 10 14M18 14v6H4V6h6",
  logout: "M15 4h4v16h-4M10 8l-4 4 4 4M6 12h10",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13",
  grip: "M9 6h.01M15 6h.01M9 12h.01M15 12h.01M9 18h.01M15 18h.01",
  plus: "M12 5v14M5 12h14",
  check: "M5 12l5 5L20 7",
  upload: "M12 16V4M7 9l5-5 5 5M4 20h16",
  search: "M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM21 21l-5-5",
  share: "M4 12v8h16v-8M12 3v13M7 8l5-5 5 5",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  alert: "M12 3 2 21h20zM12 10v5M12 18h.01",
  close: "M6 6l12 12M18 6 6 18",
  refresh: "M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7",
} as const;

export type IconName = keyof typeof ICONS;

export function Icon({ name, className, strokeWidth = 2 }: { name: IconName; className?: string; strokeWidth?: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={name === "grip" ? 3 : strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={cn("size-5 shrink-0", className)}
    >
      <path d={ICONS[name]} />
    </svg>
  );
}

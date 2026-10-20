import { GENERIC_ICONS, getPlatform } from "@/lib/platforms";
import { cn, readableOn } from "@/lib/utils";

type IconProps = { platform?: string; size?: number; color?: string; className?: string };

/** A platform's logo as an inline SVG. Unknown platforms get a link glyph. */
export function PlatformIcon({ platform, size = 22, color = "currentColor", className }: IconProps) {
  const path = (platform && getPlatform(platform)?.path) || GENERIC_ICONS.link;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden className={cn("shrink-0", className)}>
      <path d={path} fill={color} />
    </svg>
  );
}

type TileProps = IconProps & { tileSize?: number; rounded?: string };

/** The logo on its brand colour, as used in lists and the orbit. */
export function PlatformTile({ platform, size = 22, tileSize = 44, rounded = "rounded-xl", className }: TileProps) {
  const bg = (platform && getPlatform(platform)?.color) || "#121212";
  return (
    <span
      className={cn("inline-flex shrink-0 items-center justify-center", rounded, className)}
      style={{ width: tileSize, height: tileSize, background: bg }}
    >
      <PlatformIcon platform={platform} size={size} color={readableOn(bg)} />
    </span>
  );
}

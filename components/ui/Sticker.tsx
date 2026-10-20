import Image from "next/image";
import type { CSSProperties } from "react";
import arrowDown from "@/images/arrow-down.svg";
import brokenLink from "@/images/broken-link.svg";
import chain from "@/images/chain.svg";
import confettiCircle from "@/images/confetti-circle.svg";
import confettiSquare from "@/images/confetti-square.svg";
import paperPlane from "@/images/paper-plane.svg";
import person from "@/images/person.svg";
import smiley from "@/images/smiley.svg";
import smileyWhite from "@/images/smiley-white.svg";
import squiggle from "@/images/squiggle.svg";
import star from "@/images/star.svg";
import starLime from "@/images/star-lime.svg";
import starWhite from "@/images/star-white.svg";

const STICKERS = {
  arrowDown, brokenLink, chain, confettiCircle, confettiSquare, paperPlane, person,
  smiley, smileyWhite, squiggle, star, starLime, starWhite,
};

export type StickerName = keyof typeof STICKERS;

type StickerProps = {
  name: StickerName;
  size?: number;
  width?: number;
  height?: number;
  className?: string;
  style?: CSSProperties;
  /** Load immediately; use for stickers above the fold. */
  eager?: boolean;
};

/** Decorative animated SVG from /images. Hidden from assistive tech. */
export function Sticker({ name, size = 64, width, height, className, style, eager }: StickerProps) {
  return (
    <Image
      src={STICKERS[name]}
      alt=""
      aria-hidden
      width={width ?? size}
      height={height ?? size}
      className={className}
      style={style}
      draggable={false}
      loading={eager ? "eager" : undefined}
      unoptimized
    />
  );
}

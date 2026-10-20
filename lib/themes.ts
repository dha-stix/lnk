import type { CSSProperties } from "react";
import type { Appearance } from "./types";

export type Theme = {
  name: string;
  bg: string;
  text: string;
  muted: string;
  button: string;
  buttonText: string;
  /** Badge / highlight colour on the public page. */
  accent: string;
  accentText: string;
};

export const THEMES = {
  paper: { name: "Paper", bg: "#FAFAF7", text: "#121212", muted: "#55554F", button: "#121212", buttonText: "#FFFFFF", accent: "#C6F432", accentText: "#121212" },
  lime: { name: "Lime pop", bg: "#C6F432", text: "#121212", muted: "#3A3A36", button: "#121212", buttonText: "#C6F432", accent: "#FFFFFF", accentText: "#121212" },
  violet: { name: "Violet", bg: "#5B3DF5", text: "#FFFFFF", muted: "#E4DEFF", button: "#C6F432", buttonText: "#121212", accent: "#FFFFFF", accentText: "#3F24D6" },
  sunset: { name: "Sunset", bg: "#FF8A5B", text: "#121212", muted: "#3A2015", button: "#FFFFFF", buttonText: "#121212", accent: "#121212", accentText: "#FFFFFF" },
  ocean: { name: "Ocean", bg: "#DCEBFF", text: "#0B1B3F", muted: "#33486E", button: "#1D4ED8", buttonText: "#FFFFFF", accent: "#1D4ED8", accentText: "#FFFFFF" },
  blush: { name: "Bubblegum", bg: "#FCE4EC", text: "#3B0A20", muted: "#6E2A47", button: "#8E1D4F", buttonText: "#FFFFFF", accent: "#8E1D4F", accentText: "#FFFFFF" },
  mint: { name: "Mint", bg: "#DFF5E8", text: "#0D3B24", muted: "#2F5F45", button: "#0F7A40", buttonText: "#FFFFFF", accent: "#0F7A40", accentText: "#FFFFFF" },
  sand: { name: "Sand", bg: "#F3E9D7", text: "#2B2118", muted: "#5C4A3A", button: "#2B2118", buttonText: "#F3E9D7", accent: "#2B2118", accentText: "#F3E9D7" },
} satisfies Record<string, Theme>;

export type ThemeKey = keyof typeof THEMES;

export const BUTTON_STYLES = {
  filled: "Filled",
  outline: "Outline",
  pill: "Pill",
  shadow: "Hard shadow",
} as const;

export type ButtonStyleKey = keyof typeof BUTTON_STYLES;

export const FONTS = {
  funnel: { name: "Funnel Sans", css: "var(--font-funnel)" },
  isometra: { name: "Isometra", css: "var(--font-isometra)" },
  fraunces: { name: "Fraunces", css: "var(--font-fraunces)" },
  mono: { name: "Space Mono", css: "var(--font-space-mono)" },
} as const;

export type FontKey = keyof typeof FONTS;

export const DEFAULT_APPEARANCE: Appearance = {
  theme: "paper",
  buttonStyle: "filled",
  font: "funnel",
  showViews: true,
};

export function getTheme(key: string | undefined): Theme {
  return THEMES[(key ?? "paper") as ThemeKey] ?? THEMES.paper;
}

/** Inline styles for a public-page link button, shared by every preview. */
export function linkButtonStyle(style: ButtonStyleKey, theme: Theme): CSSProperties {
  switch (style) {
    case "outline":
      return { background: "transparent", color: theme.text, border: `2px solid ${theme.text}`, borderRadius: 14 };
    case "pill":
      return { background: theme.button, color: theme.buttonText, border: "2px solid transparent", borderRadius: 999 };
    case "shadow":
      return { background: theme.button, color: theme.buttonText, border: "2px solid #121212", borderRadius: 8, boxShadow: "4px 4px 0 #121212" };
    default:
      return { background: theme.button, color: theme.buttonText, border: "2px solid transparent", borderRadius: 14 };
  }
}

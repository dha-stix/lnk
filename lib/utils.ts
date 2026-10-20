import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function createId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID().slice(0, 12)
    : Math.random().toString(36).slice(2, 14);
}

// 3 significant digits: 1K, 1.05K, 10K, 12.5K, 125K, 1.25M. Truncated, so a count is never overstated.
const compact = new Intl.NumberFormat("en", { notation: "compact", maximumSignificantDigits: 3, roundingMode: "trunc" });
const full = new Intl.NumberFormat("en");

export const formatNumber = (n: number) => full.format(Math.round(n));
export const formatCompact = (n: number) => (n < 1000 ? formatNumber(n) : compact.format(Math.floor(n)));

export function formatPercent(value: number, digits = 1) {
  if (!Number.isFinite(value)) return "0%";
  return `${value.toFixed(digits).replace(/\.0$/, "")}%`;
}

/** Adds https:// when missing and rejects anything that isn't http(s) or mailto. */
export function normalizeUrl(input: string): string | null {
  const value = input.trim();
  if (!value) return null;
  const withProtocol = /^(https?:|mailto:)/i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(withProtocol);
    if (!["http:", "https:", "mailto:"].includes(url.protocol)) return null;
    if (url.protocol !== "mailto:" && !url.hostname.includes(".")) return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function getHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (parts[0][0] + (parts[1]?.[0] ?? "")).toUpperCase();
}

/** Picks black or white text for a solid hex background. */
export function readableOn(hex: string) {
  const c = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255);
  const lin = (v: number) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
  const luminance = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return luminance > 0.4 ? "#121212" : "#FFFFFF";
}

/**
 * Profile photos may only come from Google (sign-in photo) or our own Firebase
 * Storage bucket. Anything else is ignored, so a tampered profile can't make
 * the server fetch arbitrary URLs or break image rendering.
 */
export function trustedPhotoUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const { protocol, hostname } = new URL(url);
    if (protocol !== "https:") return null;
    const trusted =
      hostname === "firebasestorage.googleapis.com" ||
      hostname.endsWith(".firebasestorage.app") ||
      /^lh\d\.googleusercontent\.com$/.test(hostname);
    return trusted ? url : null;
  } catch {
    return null;
  }
}

/** Google serves tiny avatars by default; ask for a sharper one. */
export function largeGooglePhoto(url: string | null | undefined) {
  if (!url) return null;
  return url.replace(/=s\d+-c$/, "=s400-c");
}

export function dayKey(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Day keys from `count - 1` days ago up to today, oldest first. */
export function lastDayKeys(count: number, from = new Date()) {
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(from);
    d.setDate(d.getDate() - (count - 1 - i));
    return dayKey(d);
  });
}

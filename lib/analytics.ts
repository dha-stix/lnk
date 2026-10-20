import { getPlatform } from "./platforms";
import type { DayStats, Device, UserProfile } from "./types";
import { getHost, lastDayKeys } from "./utils";

export type RangeDays = 7 | 30 | 90;

export type Totals = { views: number; uniques: number; clicks: number; ctr: number };
export type Ranked = { key: string; label: string; value: number; share: number };

export type AnalyticsSummary = {
  series: { date: string; views: number; clicks: number }[];
  totals: Totals;
  previous: Totals;
  topLinks: Ranked[];
  referrers: Ranked[];
  devices: Ranked[];
  countries: Ranked[];
};

function sumTotals(days: DayStats[]): Totals {
  const t = days.reduce((acc, d) => ({ views: acc.views + d.views, uniques: acc.uniques + d.uniques, clicks: acc.clicks + d.clicks }), { views: 0, uniques: 0, clicks: 0 });
  return { ...t, ctr: t.views ? (t.clicks / t.views) * 100 : 0 };
}

function merge(days: DayStats[], pick: (d: DayStats) => Record<string, number | undefined>) {
  const out: Record<string, number> = {};
  for (const d of days) for (const [k, v] of Object.entries(pick(d))) out[k] = (out[k] ?? 0) + (v ?? 0);
  return out;
}

function rank(counts: Record<string, number>, label: (key: string) => string, limit = 6): Ranked[] {
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  return Object.entries(counts)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([key, value]) => ({ key, label: label(key), value, share: total ? (value / total) * 100 : 0 }));
}

const regionNames = typeof Intl.DisplayNames === "function" ? new Intl.DisplayNames(["en"], { type: "region" }) : null;
const DEVICE_LABELS: Record<Device, string> = { mobile: "Mobile", desktop: "Desktop", tablet: "Tablet" };

/** Splits `days` (covering 2× the range) into current/previous periods and ranks everything. */
export function summarize(days: DayStats[], range: RangeDays, profile: UserProfile): AnalyticsSummary {
  const keys = lastDayKeys(range * 2);
  const currentKeys = new Set(keys.slice(range));
  const byDate = new Map(days.map((d) => [d.date, d]));
  const current = days.filter((d) => currentKeys.has(d.date));
  const previous = days.filter((d) => !currentKeys.has(d.date));

  const linkNames = new Map<string, string>([
    ...profile.socials.map((s) => [s.id, getPlatform(s.platform)?.name ?? "Link"] as [string, string]),
    ...profile.websites.map((w) => [w.id, w.title || getHost(w.url)] as [string, string]),
  ]);

  return {
    series: keys.slice(range).map((date) => ({ date, views: byDate.get(date)?.views ?? 0, clicks: byDate.get(date)?.clicks ?? 0 })),
    totals: sumTotals(current),
    previous: sumTotals(previous),
    topLinks: rank(merge(current, (d) => d.links), (id) => linkNames.get(id) ?? "Removed link"),
    referrers: rank(merge(current, (d) => d.referrers), (k) => k),
    devices: rank(merge(current, (d) => d.devices), (k) => DEVICE_LABELS[k as Device] ?? k, 3),
    countries: rank(merge(current, (d) => d.countries), (k) => regionNames?.of(k) ?? k),
  };
}

/** Percentage change, or null when there's no previous data to compare. */
export function change(current: number, previous: number) {
  if (!previous) return null;
  return ((current - previous) / previous) * 100;
}

/** Normalises document.referrer into a readable source name. */
export function referrerSource(referrer: string, ownHost: string) {
  if (!referrer) return "Direct";
  const host = getHost(referrer);
  if (!host || host === ownHost) return "Direct";
  const aliases: Record<string, string> = {
    "l.instagram.com": "instagram.com",
    "lm.facebook.com": "facebook.com",
    "l.facebook.com": "facebook.com",
    "m.facebook.com": "facebook.com",
    "t.co": "x.com",
    "twitter.com": "x.com",
    "out.reddit.com": "reddit.com",
    "com.google.android.gm": "gmail",
  };
  return aliases[host] ?? host;
}

export function detectDevice(userAgent: string): Device {
  if (/iPad|Tablet|Nexus 7|Nexus 10|SM-T/i.test(userAgent)) return "tablet";
  if (/Mobi|Android|iPhone|iPod/i.test(userAgent)) return "mobile";
  return "desktop";
}

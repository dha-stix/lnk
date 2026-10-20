"use client";

import { useEffect, useMemo, useState } from "react";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { useStats } from "@/components/dashboard/useStats";
import { CopyLinkButton } from "@/components/dashboard/CopyLinkButton";
import { CountUp } from "@/components/ui/CountUp";
import { Panel } from "@/components/ui/Panel";
import { Sticker } from "@/components/ui/Sticker";
import { getDailyStats, getErrorMessage } from "@/firebase/firebase-actions";
import { change, summarize, type Ranked, type RangeDays } from "@/lib/analytics";
import type { DayStats } from "@/lib/types";
import { cn, formatNumber, formatPercent } from "@/lib/utils";

const RANGES: RangeDays[] = [7, 30, 90];

function Delta({ value }: { value: number | null }) {
  if (value === null) return <span className="text-[13px] text-muted">No earlier data</span>;
  const up = value >= 0;
  return (
    <span className={cn("text-[13px] font-bold", up ? "text-success" : "text-danger")}>
      {up ? "▲" : "▼"} {formatPercent(Math.abs(value))} vs previous period
    </span>
  );
}

function StatTile({ label, value, previous, suffix, decimals, highlight }: { label: string; value: number; previous: number; suffix?: string; decimals?: number; highlight?: boolean }) {
  return (
    <div className={cn("lift flex flex-col gap-1.5 rounded-3xl border-2 p-5", highlight ? "border-ink bg-lime" : "border-line bg-white")}>
      <span className="text-sm text-muted">{label}</span>
      <CountUp value={value} suffix={suffix} decimals={decimals} className="text-[32px] font-bold leading-tight" />
      <Delta value={change(value, previous)} />
    </div>
  );
}

function BarList({ items, empty, color = "#5B3DF5" }: { items: Ranked[]; empty: string; color?: string }) {
  if (!items.length) return <p className="text-sm text-muted">{empty}</p>;
  return (
    <ul className="flex flex-col gap-3.5">
      {items.map((item) => (
        <li key={item.key} className="flex flex-col gap-1.5">
          <div className="flex justify-between gap-3 text-[15px]">
            <span className="truncate font-medium">{item.label}</span>
            <span className="shrink-0 font-bold">{formatNumber(item.value)}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-sand">
            <div className="animate-widen h-full rounded-full" style={{ width: `${Math.max(item.share, 3)}%`, background: color }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function ViewsChart({ series }: { series: { date: string; views: number; clicks: number }[] }) {
  const max = Math.max(1, ...series.map((d) => d.views + d.clicks));
  const label = (date: string) => new Date(`${date}T00:00:00`).toLocaleDateString("en", { month: "short", day: "numeric" });
  return (
    <div>
      <ol className="flex h-56 items-end gap-[3px] border-b border-line" aria-label="Views and clicks per day">
        {series.map((d, i) => (
          <li
            key={d.date}
            tabIndex={0}
            aria-label={`${label(d.date)}: ${d.views} views, ${d.clicks} clicks`}
            className="group relative flex h-full flex-1 flex-col justify-end outline-none"
          >
            <span className="pointer-events-none absolute bottom-[calc(100%+6px)] left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border-2 border-ink bg-white px-2.5 py-1.5 text-xs font-semibold shadow-brutal-sm group-hover:block group-focus:block">
              {label(d.date)} · {d.views} views · {d.clicks} clicks
            </span>
            <span className="animate-grow flex flex-col justify-end transition-[filter] group-hover:brightness-125" style={{ height: `${((d.views + d.clicks) / max) * 100}%`, animationDelay: `${i * 0.015}s` }}>
              <span className="rounded-t-[4px] bg-ink" style={{ flexGrow: d.views || 0.0001 }} />
              <span className="bg-lime-deep" style={{ flexGrow: d.clicks || 0.0001 }} />
            </span>
          </li>
        ))}
      </ol>
      <div className="mt-2 flex justify-between text-xs text-muted">
        <span>{series[0] && label(series[0].date)}</span>
        <span>Today</span>
      </div>
    </div>
  );
}

export function AnalyticsView() {
  const { profile } = useDashboard();
  const stats = useStats(profile.uid);
  const [range, setRange] = useState<RangeDays>(30);
  const [result, setResult] = useState<{ range: RangeDays; days: DayStats[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getDailyStats(profile.uid, range * 2)
      .then((days) => {
        if (cancelled) return;
        setResult({ range, days });
        setError(null);
      })
      .catch((e) => {
        if (!cancelled) setError(getErrorMessage(e, "Couldn't load your analytics."));
      });
    return () => {
      cancelled = true;
    };
  }, [profile.uid, range]);

  const summary = useMemo(() => (result ? summarize(result.days, result.range, profile) : null), [result, profile]);
  const loading = !result || result.range !== range;

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted">
          All-time: <strong className="text-ink">{formatNumber(stats?.views ?? 0)}</strong> views ·{" "}
          <strong className="text-ink">{formatNumber(stats?.clicks ?? 0)}</strong> clicks
        </p>
        <div role="radiogroup" aria-label="Date range" className="flex gap-1 rounded-full border border-line bg-white p-1">
          {RANGES.map((r) => (
            <button
              key={r}
              type="button"
              role="radio"
              aria-checked={range === r}
              onClick={() => setRange(r)}
              className={cn("min-h-10 rounded-full px-4 text-sm font-bold transition-colors", range === r ? "bg-ink text-white" : "hover:bg-sand")}
            >
              {r}d
            </button>
          ))}
        </div>
      </div>

      {error && <p className="rounded-2xl border-2 border-danger bg-white p-4 text-sm font-semibold text-danger">{error}</p>}

      {loading && !error ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4" aria-busy="true" aria-label="Loading analytics">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-32 rounded-3xl" />
          ))}
          <div className="skeleton col-span-full h-72 rounded-3xl" />
        </div>
      ) : summary ? (
        <>
          <div className="stagger grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4">
            <StatTile label="Page views" value={summary.totals.views} previous={summary.previous.views} />
            <StatTile label="Unique visitors" value={summary.totals.uniques} previous={summary.previous.uniques} />
            <StatTile label="Link clicks" value={summary.totals.clicks} previous={summary.previous.clicks} />
            <StatTile label="Click-through rate" value={summary.totals.ctr} previous={summary.previous.ctr} suffix="%" decimals={1} highlight />
          </div>

          {summary.totals.views === 0 ? (
            <Panel className="items-center py-12 text-center">
              <Sticker name="paperPlane" size={96} />
              <h2 className="font-display text-2xl">No visits in the last {range} days yet</h2>
              <p className="max-w-sm text-muted">Share your link in your bios and stories. Views and clicks will show up here as they happen.</p>
              <CopyLinkButton username={profile.username} label="Copy my link" className="min-h-12 px-6 text-sm" />
            </Panel>
          ) : (
            <Panel
              title="Views over time"
              action={
                <div className="flex gap-4 text-[13px] text-muted">
                  <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-[3px] bg-ink" />Views</span>
                  <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-[3px] bg-lime-deep" />Clicks</span>
                </div>
              }
            >
              <ViewsChart series={summary.series} />
            </Panel>
          )}

          <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-5">
            <Panel title="Top links">
              <BarList items={summary.topLinks} empty="No clicks yet." />
            </Panel>
            <Panel title="Top referrers">
              <BarList items={summary.referrers} empty="No visits yet." color="#121212" />
            </Panel>
            <Panel title="Devices">
              <BarList items={summary.devices} empty="No visits yet." color="#9BC72A" />
            </Panel>
            <Panel title="Countries">
              <BarList items={summary.countries} empty="Country data appears once your site is deployed." color="#FF8A5B" />
            </Panel>
          </div>
        </>
      ) : null}
    </>
  );
}

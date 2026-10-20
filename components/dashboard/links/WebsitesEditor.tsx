"use client";

import { useState } from "react";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Panel } from "@/components/ui/Panel";
import { Toggle } from "@/components/ui/Toggle";
import { MAX_WEBSITES } from "@/lib/platforms";
import type { Website } from "@/lib/types";
import { cn, createId, normalizeUrl } from "@/lib/utils";
import { SortableList } from "./SortableList";

const input = "w-full rounded-lg border border-line-strong px-3 py-2 text-[15px] outline-none transition-colors focus:border-ink aria-invalid:border-danger";

export function WebsitesEditor() {
  const { profile, update } = useDashboard();
  const [focusId, setFocusId] = useState<string | null>(null);
  const websites = profile.websites;
  const full = websites.length >= MAX_WEBSITES;

  const save = (next: Website[]) => update({ websites: next });
  const patch = (id: string, changes: Partial<Website>) => save(websites.map((w) => (w.id === id ? { ...w, ...changes } : w)));
  const add = () => {
    if (full) return;
    const id = createId();
    save([...websites, { id, title: "", url: "", enabled: true }]);
    setFocusId(id);
  };

  return (
    <Panel
      title="Personal websites"
      description={`Optional · ${websites.length} of ${MAX_WEBSITES} used`}
      action={
        <Button variant="outline" size="sm" shape="rounded" icon={<Icon name="plus" className="size-4" />} onClick={add} disabled={full}>
          {full ? "Limit reached" : "Add website"}
        </Button>
      }
    >
      {websites.length === 0 ? (
        <p className="rounded-2xl border-2 border-dashed border-line-strong px-4 py-6 text-center text-sm text-muted">
          Portfolio, shop, newsletter… add up to {MAX_WEBSITES} sites of your own.
        </p>
      ) : (
        <SortableList
          items={websites}
          onReorder={save}
          renderItem={(site, handle) => {
            const invalid = site.url.trim() !== "" && !normalizeUrl(site.url);
            return (
              <div className={cn("animate-pop flex flex-wrap items-center gap-3 rounded-2xl border bg-white p-3 transition-colors hover:border-ink", invalid ? "border-danger" : "border-line", !site.enabled && "bg-sand")}>
                {handle}
                <div className="grid min-w-0 flex-1 grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-2">
                  <input aria-label="Website title" autoFocus={focusId === site.id} value={site.title} onChange={(e) => patch(site.id, { title: e.target.value })} placeholder="Title, e.g. My Portfolio" maxLength={60} className={input} />
                  <input aria-label="Website URL" aria-invalid={invalid} value={site.url} onChange={(e) => patch(site.id, { url: e.target.value })} placeholder="yoursite.com" inputMode="url" className={input} />
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <Toggle size="sm" checked={site.enabled} onChange={(enabled) => patch(site.id, { enabled })} label={`Show ${site.title || "website"} on my page`} />
                  <button type="button" onClick={() => save(websites.filter((w) => w.id !== site.id))} aria-label={`Remove ${site.title || "website"}`} className="grid size-10 place-items-center rounded-lg text-muted transition-colors hover:bg-[#FDECEA] hover:text-danger">
                    <Icon name="trash" className="size-[18px]" />
                  </button>
                </div>
                {invalid && <span className="w-full pl-[52px] text-xs font-semibold text-danger">Enter a full web address, like yoursite.com.</span>}
              </div>
            );
          }}
        />
      )}
    </Panel>
  );
}

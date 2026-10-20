"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Panel } from "@/components/ui/Panel";
import { PlatformTile } from "@/components/ui/PlatformIcon";
import { Toggle } from "@/components/ui/Toggle";
import { getPlatform, resolvePlatformUrl, type PlatformKey } from "@/lib/platforms";
import type { SocialLink } from "@/lib/types";
import { cn, createId } from "@/lib/utils";
import { AddPlatformModal } from "./AddPlatformModal";
import { SortableList } from "./SortableList";

const SUGGESTED: PlatformKey[] = ["instagram", "tiktok", "youtube", "spotify", "x"];

export function SocialLinksEditor() {
  const { profile, update } = useDashboard();
  const [picking, setPicking] = useState(false);
  const [focusId, setFocusId] = useState<string | null>(null);
  const socials = profile.socials;
  const added = useMemo(() => new Set(socials.map((s) => s.platform)), [socials]);

  // Focus the new link's field once the dialog has closed and handed focus back.
  useEffect(() => {
    if (!focusId) return;
    const id = setTimeout(() => {
      const input = document.getElementById(`social-${focusId}`);
      input?.focus();
      input?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 60);
    return () => clearTimeout(id);
  }, [focusId]);

  const save = (next: SocialLink[]) => update({ socials: next });
  const patch = (id: string, changes: Partial<SocialLink>) =>
    save(socials.map((s) => {
      if (s.id !== id) return s;
      const next = { ...s, ...changes };
      return { ...next, url: resolvePlatformUrl(next.platform, next.value) ?? "" };
    }));

  const add = (platform: PlatformKey) => {
    const id = createId();
    save([...socials, { id, platform, value: "", url: "", enabled: true }]);
    setFocusId(id);
  };

  const remove = (link: SocialLink) => {
    const before = socials;
    save(socials.filter((s) => s.id !== link.id));
    toast(`${getPlatform(link.platform)?.name ?? "Link"} removed`, {
      action: { label: "Undo", onClick: () => save(before) },
    });
  };

  return (
    <Panel
      title="Social links"
      description="Drag to reorder. Visitors see them as icons and buttons."
      action={
        <Button variant="lime" size="sm" shape="rounded" icon={<Icon name="plus" className="size-4" />} onClick={() => setPicking(true)}>
          Add platform
        </Button>
      }
    >
      {socials.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-line-strong px-4 py-8 text-center">
          <p className="font-semibold">Add your first platform</p>
          <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTED.map((key) => (
              <button key={key} type="button" onClick={() => add(key)} className="jelly flex items-center gap-2 rounded-full border-2 border-ink bg-white py-1.5 pl-1.5 pr-4 text-sm font-semibold">
                <PlatformTile platform={key} tileSize={30} size={16} rounded="rounded-full" />
                {getPlatform(key)?.name}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <SortableList
          items={socials}
          onReorder={save}
          renderItem={(link, handle) => (
            <SocialRow link={link} handle={handle} onChange={(c) => patch(link.id, c)} onRemove={() => remove(link)} />
          )}
        />
      )}

      <p className="text-[13px] leading-relaxed text-muted">
        Includes Instagram, TikTok, YouTube, Spotify, X, Facebook, LinkedIn, Bluesky, Mastodon, Discord, Telegram, WhatsApp, OnlyFans, Patreon, Substack, blogs and more.
      </p>

      <AddPlatformModal open={picking} onClose={() => setPicking(false)} onPick={add} added={added} />
    </Panel>
  );
}

type SocialRowProps = {
  link: SocialLink;
  handle: ReactNode;
  onChange: (changes: Partial<SocialLink>) => void;
  onRemove: () => void;
};

function SocialRow({ link, handle, onChange, onRemove }: SocialRowProps) {
  const platform = getPlatform(link.platform);
  const invalid = link.value.trim() !== "" && !link.url;
  const inputId = `social-${link.id}`;

  return (
    <div className={cn("animate-pop flex flex-wrap items-center gap-3 rounded-2xl border bg-white p-3 transition-colors hover:border-ink", invalid ? "border-danger" : "border-line", !link.enabled && "bg-sand")}>
      {handle}
      <PlatformTile platform={link.platform} tileSize={42} size={21} />
      <div className="flex min-w-[180px] flex-1 flex-col gap-1">
        <label htmlFor={inputId} className="text-[13px] font-bold">
          {platform?.name}
        </label>
        <input
          id={inputId}
          value={link.value}
          onChange={(e) => onChange({ value: e.target.value })}
          placeholder={platform?.placeholder}
          aria-invalid={invalid}
          aria-describedby={invalid ? `${inputId}-err` : undefined}
          className="w-full rounded-lg border border-line-strong px-3 py-2 text-[15px] outline-none transition-colors focus:border-ink"
        />
        {invalid ? (
          <span id={`${inputId}-err`} className="text-xs font-semibold text-danger">That doesn&apos;t look like a valid link yet.</span>
        ) : link.url ? (
          <span className="truncate text-xs text-muted">{link.url}</span>
        ) : null}
      </div>
      <div className="ml-auto flex items-center gap-1">
        <Toggle size="sm" checked={link.enabled} onChange={(enabled) => onChange({ enabled })} label={`Show ${platform?.name} on my page`} />
        <button type="button" onClick={onRemove} aria-label={`Remove ${platform?.name}`} className="grid size-10 place-items-center rounded-lg text-muted transition-colors hover:bg-[#FDECEA] hover:text-danger">
          <Icon name="trash" className="size-[18px]" />
        </button>
      </div>
    </div>
  );
}

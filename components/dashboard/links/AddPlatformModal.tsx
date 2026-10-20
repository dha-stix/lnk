"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { Modal } from "@/components/ui/Modal";
import { PlatformTile } from "@/components/ui/PlatformIcon";
import { CATEGORY_LABELS, PLATFORM_LIST, type PlatformCategory, type PlatformKey } from "@/lib/platforms";

type AddPlatformModalProps = {
  open: boolean;
  onClose: () => void;
  onPick: (key: PlatformKey) => void;
  added: Set<PlatformKey>;
};

export function AddPlatformModal({ open, onClose, onPick, added }: AddPlatformModalProps) {
  const [query, setQuery] = useState("");

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase();
    const matches = PLATFORM_LIST.filter((p) => !q || p.name.toLowerCase().includes(q) || p.key.includes(q));
    return (Object.keys(CATEGORY_LABELS) as PlatformCategory[])
      .map((category) => ({ category, items: matches.filter((p) => p.category === category) }))
      .filter((g) => g.items.length);
  }, [query]);

  const close = () => {
    setQuery("");
    onClose();
  };

  return (
    <Modal open={open} onClose={close} title="Add a platform" description="Pick where people can find you.">
      <label className="mb-5 flex items-center gap-2 rounded-xl border-2 border-line-strong px-4 focus-within:border-ink">
        <Icon name="search" className="text-muted" />
        <span className="sr-only">Search platforms</span>
        <input
          data-autofocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Instagram, Spotify, OnlyFans…"
          className="min-w-0 flex-1 bg-transparent py-3 outline-none"
        />
      </label>

      {groups.length === 0 && <p className="py-8 text-center text-muted">No platform matches “{query}”. Add it as a personal website instead.</p>}

      <div className="flex flex-col gap-6">
        {groups.map(({ category, items }) => (
          <section key={category}>
            <h3 className="mb-3 text-xs font-bold tracking-[0.08em] text-muted">{CATEGORY_LABELS[category].toUpperCase()}</h3>
            <ul className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-2.5">
              {items.map((p) => (
                <li key={p.key}>
                  <button
                    type="button"
                    onClick={() => {
                      onPick(p.key);
                      close();
                    }}
                    className="jelly relative flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-line bg-white p-3 text-sm font-semibold transition-colors hover:border-ink"
                  >
                    <PlatformTile platform={p.key} tileSize={44} size={22} />
                    <span className="text-center leading-tight">{p.name}</span>
                    {added.has(p.key) && (
                      <span className="absolute right-2 top-2 grid size-5 place-items-center rounded-full bg-success text-white" title="Already added">
                        <Icon name="check" className="size-3" strokeWidth={3} />
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Modal>
  );
}

"use client";

import type { ReactNode } from "react";
import { useDashboard } from "@/components/dashboard/DashboardProvider";
import { Icon } from "@/components/ui/Icon";
import { Panel } from "@/components/ui/Panel";
import { Toggle } from "@/components/ui/Toggle";
import { BUTTON_STYLES, FONTS, linkButtonStyle, THEMES, type ButtonStyleKey, type FontKey, type ThemeKey } from "@/lib/themes";
import type { Appearance } from "@/lib/types";
import { cn } from "@/lib/utils";

function Option({ selected, onClick, label, children, className }: { selected: boolean; onClick: () => void; label: string; children: ReactNode; className?: string }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "jelly relative flex flex-col gap-2 rounded-2xl border-2 bg-paper p-3 text-left transition-colors",
        selected ? "border-violet shadow-[0_0_0_3px_#5B3DF5]" : "border-line hover:border-ink",
        className,
      )}
    >
      {children}
      {selected && (
        <span className="animate-pop absolute right-2 top-2 grid size-6 place-items-center rounded-full bg-violet text-white">
          <Icon name="check" className="size-3.5" strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

export function AppearanceEditor() {
  const { profile, update } = useDashboard();
  const a = profile.appearance;
  const set = (changes: Partial<Appearance>) => update({ appearance: { ...a, ...changes } });
  const theme = THEMES[a.theme];

  return (
    <>
      <Panel title="Theme" description="Background, text and button colours for your page.">
        <div role="radiogroup" aria-label="Theme" className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-3.5">
          {(Object.keys(THEMES) as ThemeKey[]).map((key) => {
            const t = THEMES[key];
            return (
              <Option key={key} selected={a.theme === key} onClick={() => set({ theme: key })} label={`${t.name} theme`}>
                <span className="flex aspect-[3/4] w-full flex-col justify-center gap-1.5 rounded-xl border border-line p-3.5" style={{ background: t.bg }}>
                  <span className="mx-auto mb-1 size-6 rounded-full" style={{ background: t.button }} />
                  {[0, 1, 2].map((i) => (
                    <span key={i} className="h-3.5 rounded-md" style={{ background: t.button }} />
                  ))}
                </span>
                <span className="text-sm font-bold">{t.name}</span>
              </Option>
            );
          })}
        </div>
      </Panel>

      <Panel title="Buttons" description="How your links are shaped.">
        <div role="radiogroup" aria-label="Button style" className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
          {(Object.keys(BUTTON_STYLES) as ButtonStyleKey[]).map((key) => (
            <Option key={key} selected={a.buttonStyle === key} onClick={() => set({ buttonStyle: key })} label={`${BUTTON_STYLES[key]} buttons`} className="p-4">
              <span className="flex h-10 items-center justify-center text-[13px] font-semibold" style={linkButtonStyle(key, theme)}>
                Link
              </span>
              <span className="text-sm font-bold">{BUTTON_STYLES[key]}</span>
            </Option>
          ))}
        </div>
      </Panel>

      <Panel title="Font" description="The typeface visitors see on your page.">
        <div role="radiogroup" aria-label="Font" className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
          {(Object.keys(FONTS) as FontKey[]).map((key) => (
            <Option key={key} selected={a.font === key} onClick={() => set({ font: key })} label={`${FONTS[key].name} font`} className="items-start p-4">
              <span className="text-3xl leading-none" style={{ fontFamily: FONTS[key].css }}>
                Aa
              </span>
              <span className="text-sm font-bold">{FONTS[key].name}</span>
            </Option>
          ))}
        </div>
      </Panel>

      <Panel>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold">Show view count on my page</h2>
            <p className="text-sm text-muted">Visitors see your total page views under your name.</p>
          </div>
          <Toggle checked={a.showViews} onChange={(showViews) => set({ showViews })} label="Show view count on my page" />
        </div>
      </Panel>
    </>
  );
}

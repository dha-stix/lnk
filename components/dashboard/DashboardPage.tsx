import type { ReactNode } from "react";
import { LivePreview } from "./LivePreview";

type DashboardPageProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  /** Show the phone preview beside the content. */
  preview?: boolean;
  children: ReactNode;
};

export function DashboardPage({ title, description, actions, preview, children }: DashboardPageProps) {
  return (
    <div className="flex flex-wrap items-start gap-8">
      <div className="stagger flex min-w-0 flex-[999_1_520px] flex-col gap-5">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="font-display text-[clamp(30px,3.4vw,40px)] leading-tight tracking-[-0.02em]">{title}</h1>
            {description && <p className="mt-1 text-muted">{description}</p>}
          </div>
          {actions}
        </header>
        {children}
      </div>
      {preview && (
        <aside className="mx-auto flex-[1_1_300px]" aria-label="Preview of your public page">
          <LivePreview />
        </aside>
      )}
    </div>
  );
}

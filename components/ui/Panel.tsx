import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PanelProps = {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
  children?: ReactNode;
};

/** The white rounded card every dashboard section sits in. */
export function Panel({ title, description, action, className, children }: PanelProps) {
  return (
    <section className={cn("flex flex-col gap-5 rounded-3xl border border-line bg-white p-5 sm:p-6", className)}>
      {(title || action) && (
        <header className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            {title && <h2 className="text-xl font-bold">{title}</h2>}
            {description && <p className="text-sm text-muted">{description}</p>}
          </div>
          {action}
        </header>
      )}
      {children}
    </section>
  );
}

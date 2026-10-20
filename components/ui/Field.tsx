"use client";

import { useId, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const control =
  "w-full rounded-xl border-2 border-line-strong bg-white px-4 py-3 text-base text-ink placeholder:text-muted/70 transition-colors focus:border-ink focus:outline-none disabled:bg-sand";

type FieldShellProps = {
  label: string;
  hint?: ReactNode;
  error?: string | null;
  counter?: string;
  hideLabel?: boolean;
  children: (id: string, describedBy?: string) => ReactNode;
};

function FieldShell({ label, hint, error, counter, hideLabel, children }: FieldShellProps) {
  const id = useId();
  const describedBy = error || hint ? `${id}-desc` : undefined;
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className={cn("text-sm font-bold", hideLabel && "sr-only")}>
        {label}
      </label>
      {children(id, describedBy)}
      {(error || hint || counter) && (
        <div className="flex items-start justify-between gap-3 text-[13px]">
          <span id={describedBy} className={error ? "font-semibold text-danger" : "text-muted"}>
            {error || hint}
          </span>
          {counter && <span className="shrink-0 text-muted">{counter}</span>}
        </div>
      )}
    </div>
  );
}

type InputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "children"> &
  Omit<FieldShellProps, "children"> & { prefix?: ReactNode; suffix?: ReactNode };

export function TextField({ label, hint, error, counter, hideLabel, prefix, suffix, className, ...props }: InputProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} counter={counter} hideLabel={hideLabel}>
      {(id, describedBy) =>
        prefix || suffix ? (
          <div className={cn("flex items-center rounded-xl border-2 bg-white px-4 transition-colors focus-within:border-ink", error ? "border-danger" : "border-line-strong")}>
            {prefix && <span className="shrink-0 text-muted">{prefix}</span>}
            <input id={id} aria-describedby={describedBy} aria-invalid={Boolean(error)} className={cn("min-w-0 flex-1 bg-transparent px-1 py-3 text-base outline-none", className)} {...props} />
            {suffix}
          </div>
        ) : (
          <input id={id} aria-describedby={describedBy} aria-invalid={Boolean(error)} className={cn(control, error && "border-danger", className)} {...props} />
        )
      }
    </FieldShell>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & Omit<FieldShellProps, "children">;

export function TextAreaField({ label, hint, error, counter, hideLabel, className, ...props }: TextareaProps) {
  return (
    <FieldShell label={label} hint={hint} error={error} counter={counter} hideLabel={hideLabel}>
      {(id, describedBy) => (
        <textarea id={id} aria-describedby={describedBy} className={cn(control, "resize-y", className)} {...props} />
      )}
    </FieldShell>
  );
}

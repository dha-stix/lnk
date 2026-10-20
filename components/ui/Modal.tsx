"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

/** Native <dialog> so focus trapping and Esc come for free. */
export function Modal({ open, onClose, title, description, children, className }: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      // showModal() focuses the first button; prefer a field marked data-autofocus.
      dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-label={title}
      className={cn(
        "m-auto w-[min(560px,calc(100vw-32px))] max-h-[calc(100dvh-48px)] overflow-hidden rounded-3xl border-2 border-ink bg-white p-0 text-ink shadow-brutal-lg",
        "backdrop:bg-ink/40 backdrop:backdrop-blur-sm open:animate-pop",
        className,
      )}
    >
      {open && (
        <div className="flex max-h-[calc(100dvh-52px)] flex-col">
          <header className="flex items-start justify-between gap-4 border-b border-line p-5 sm:p-6">
            <div>
              <h2 className="font-display text-2xl">{title}</h2>
              {description && <p className="mt-1 text-sm text-muted">{description}</p>}
            </div>
            <button type="button" onClick={onClose} aria-label="Close" className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-ink transition-transform hover:rotate-90">
              <svg viewBox="0 0 24 24" className="size-5" aria-hidden>
                <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          </header>
          <div className="overflow-y-auto p-5 sm:p-6">{children}</div>
        </div>
      )}
    </dialog>
  );
}

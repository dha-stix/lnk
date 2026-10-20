import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

type AuthShellProps = {
  children: ReactNode;
  aside: ReactNode;
  /** Which side the illustration sits on at desktop widths. */
  asideSide?: "left" | "right";
  asideClassName?: string;
};

export function AuthShell({ children, aside, asideSide = "right", asideClassName }: AuthShellProps) {
  return (
    <div className={cn("flex min-h-dvh flex-wrap", asideSide === "left" && "flex-row-reverse")}>
      <div className="flex min-w-0 flex-[1_1_520px] flex-col px-5 py-8 sm:px-8">
        <Logo size="lg" />
        <main className="flex flex-1 items-center justify-center py-12">
          <div className="stagger flex w-full max-w-[420px] flex-col gap-6">{children}</div>
        </main>
        <p className="text-[13px] text-muted">
          By continuing you agree to our{" "}
          <Link href="#" className="font-semibold text-violet underline-offset-2 hover:underline">Terms</Link> and{" "}
          <Link href="#" className="font-semibold text-violet underline-offset-2 hover:underline">Privacy Policy</Link>.
        </p>
      </div>
      <aside className={cn("relative flex min-h-[420px] min-w-0 flex-[1_1_520px] items-center justify-center overflow-hidden px-6 py-12", asideClassName)}>
        {aside}
      </aside>
    </div>
  );
}

export function AuthHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="font-display text-[44px] leading-none tracking-[-0.02em]">{title}</h1>
      <p className="text-[17px] leading-relaxed text-muted">{subtitle}</p>
    </div>
  );
}

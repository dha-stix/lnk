"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers/AuthProvider";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "#features", label: "Features" },
  { href: "#platforms", label: "Platforms" },
  { href: "#themes", label: "Themes" },
  { href: "#analytics", label: "Analytics" },
];

export function Navbar() {
  const { user, profile } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const signedIn = Boolean(user && profile);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled || open ? "border-b-2 border-ink bg-paper/90 backdrop-blur-md" : "border-b-2 border-transparent",
      )}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4 px-4 py-4 sm:px-5">
        <Logo size="lg" />
        <nav aria-label="Main" className="hidden items-center gap-7 font-medium md:flex">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="relative text-body after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-violet after:transition-all hover:text-ink hover:after:w-full">
              {item.label}
            </a>
          ))}
          {signedIn ? (
            <Button href="/dashboard">Dashboard</Button>
          ) : (
            <>
              <Link href="/auth/login" className="font-semibold text-ink hover:text-violet">
                Log in
              </Link>
              <Button href="/auth/register">Get started free</Button>
            </>
          )}
        </nav>
        <button
          type="button"
          className="grid size-11 place-items-center rounded-full border-2 border-ink bg-white md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <span className="relative block h-3.5 w-5">
            <span className={cn("absolute left-0 top-0 h-0.5 w-5 bg-ink transition-transform", open && "translate-y-1.5 rotate-45")} />
            <span className={cn("absolute left-0 top-1.5 h-0.5 w-5 bg-ink transition-opacity", open && "opacity-0")} />
            <span className={cn("absolute left-0 top-3 h-0.5 w-5 bg-ink transition-transform", open && "-translate-y-1.5 -rotate-45")} />
          </span>
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="stagger flex flex-col gap-1 border-t border-line px-4 pb-5 pt-3 md:hidden">
          {NAV.map((item) => (
            <a key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-xl px-3 py-3 text-lg font-semibold hover:bg-sand">
              {item.label}
            </a>
          ))}
          <div className="mt-2 flex flex-col gap-2">
            {signedIn ? (
              <Button href="/dashboard" size="lg">Go to dashboard</Button>
            ) : (
              <>
                <Button href="/auth/register" size="lg">Get started free</Button>
                <Button href="/auth/login" size="lg" variant="outline">Log in</Button>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

export function Footer() {
  return (
    <footer className="border-t-2 border-ink px-4 py-10 sm:px-5">
      <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-6 text-[15px] text-body">
        <div className="flex flex-col gap-2">
          <Logo size="sm" />
          <span>One link for everything you are.</span>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-6">
          <Link href="/auth/register" className="hover:text-violet">Create your Lnk</Link>
          <Link href="/auth/login" className="hover:text-violet">Log in</Link>
          <a href="#platforms" className="hover:text-violet">Platforms</a>
        </nav>
        <div className="flex flex-col gap-1 sm:items-end">
          <span>© 2026 Lnk</span>
          <span>
            Built by{" "}
            <a
              href="https://www.linkedin.com/in/david-asaolu234/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-ink underline decoration-violet decoration-2 underline-offset-4 hover:text-violet"
            >
              David Asaolu
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}

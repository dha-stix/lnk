import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { Sticker } from "@/components/ui/Sticker";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col bg-paper">
      <header className="px-5 py-6">
        <Logo size="lg" />
      </header>
      <main className="stagger flex flex-1 flex-col items-center justify-center gap-6 px-5 pb-16 text-center">
        <p className="font-display text-[clamp(120px,22vw,240px)] leading-[0.85] tracking-[-0.05em]" aria-hidden>
          4<span className="animate-floaty inline-block rounded-full bg-lime px-[0.08em] [--r:-8deg]">0</span>4
        </p>
        <Sticker name="brokenLink" width={160} height={70} eager />
        <h1 className="font-display text-[clamp(28px,4vw,44px)] tracking-[-0.02em]">This lnk doesn&apos;t exist… yet.</h1>
        <p className="max-w-[460px] text-lg leading-relaxed text-muted">The username might be free. Grab it before someone else does.</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/auth/register" size="lg" className="[--lift-shadow:#C6F432]">Claim a username</Button>
          <Button href="/" size="lg" variant="outline">Back home</Button>
        </div>
      </main>
    </div>
  );
}

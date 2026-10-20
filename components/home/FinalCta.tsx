import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Sticker } from "@/components/ui/Sticker";

export function FinalCta() {
  return (
    <section className="px-4 pb-24 sm:px-5 lg:pb-28">
      <Reveal className="relative mx-auto flex max-w-[1200px] flex-col items-center gap-6 overflow-hidden rounded-[32px] border-[3px] border-ink bg-lime px-6 py-20 text-center shadow-[8px_8px_0_#121212]">
        <Sticker name="confettiSquare" size={40} className="animate-floaty absolute left-[8%] top-8 [--r:20deg]" />
        <Sticker name="confettiCircle" size={44} className="animate-floaty absolute bottom-9 right-[10%] [animation-delay:.4s]" />
        <Sticker name="starWhite" size={56} className="absolute right-[16%] top-10 animate-spin-slow max-sm:hidden" />
        <Sticker name="smileyWhite" size={52} className="animate-floaty absolute bottom-10 left-[12%] max-sm:hidden" />
        <SectionHeading size="xl">Your name is waiting.</SectionHeading>
        <Sticker name="arrowDown" width={40} height={48} className="animate-floaty [animation-duration:1.4s]" />
        <Button href="/auth/register" size="lg">
          Continue with Google
        </Button>
      </Reveal>
    </section>
  );
}

"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Icon } from "@/components/ui/Icon";
import { profileUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

export function CopyLinkButton({ username, className, label = "Copy" }: { username: string; className?: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl(username));
      setCopied(true);
      toast.success("Link copied. Paste it in your bios!");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy. Long-press the link to copy it instead.");
    }
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={cn("jelly inline-flex min-h-10 items-center gap-1.5 rounded-full bg-ink px-4 text-[13px] font-bold text-white", className)}
    >
      <Icon name={copied ? "check" : "copy"} className="size-4" />
      {copied ? "Copied" : label}
    </button>
  );
}

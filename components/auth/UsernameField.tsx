"use client";

import { useEffect, useState } from "react";
import { TextField } from "@/components/ui/Field";
import { Spinner } from "@/components/ui/Spinner";
import { isUsernameAvailable } from "@/firebase/firebase-actions";
import { isFirebaseConfigured } from "@/firebase/firebase";
import { useDebouncedValue } from "@/lib/hooks";
import { siteHost } from "@/lib/site";
import { sanitizeUsernameInput, validateUsername } from "@/lib/username";

export type UsernameStatus = "idle" | "checking" | "available" | "taken" | "invalid" | "error";

type UsernameFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onStatusChange?: (status: UsernameStatus) => void;
  /** The user's current username, which counts as available. */
  current?: string;
  label?: string;
};

export function UsernameField({ value, onChange, onStatusChange, current, label = "Username" }: UsernameFieldProps) {
  const debounced = useDebouncedValue(value, 450);
  const [result, setResult] = useState<{ name: string; status: UsernameStatus }>({ name: "", status: "idle" });
  const invalid = value ? validateUsername(value) : null;

  useEffect(() => {
    if (!debounced || validateUsername(debounced) || debounced === current) return;
    if (!isFirebaseConfigured) return;
    let cancelled = false;
    isUsernameAvailable(debounced)
      .then((ok) => !cancelled && setResult({ name: debounced, status: ok ? "available" : "taken" }))
      .catch(() => !cancelled && setResult({ name: debounced, status: "error" }));
    return () => {
      cancelled = true;
    };
  }, [debounced, current]);

  let status: UsernameStatus = "idle";
  if (!value) status = "idle";
  else if (invalid) status = "invalid";
  else if (value === current) status = "available";
  else if (result.name === value) status = result.status;
  else if (isFirebaseConfigured) status = "checking";

  useEffect(() => onStatusChange?.(status), [status, onStatusChange]);

  const badge = {
    idle: null,
    checking: <Spinner className="size-4 text-muted" />,
    available: <span className="animate-pop text-[13px] font-bold text-success">Available</span>,
    taken: <span className="animate-pop text-[13px] font-bold text-danger">Taken</span>,
    invalid: null,
    error: <span className="text-[13px] font-bold text-danger">Couldn&apos;t check</span>,
  }[status];

  return (
    <TextField
      label={label}
      value={value}
      onChange={(e) => onChange(sanitizeUsernameInput(e.target.value))}
      placeholder="yourname"
      autoComplete="off"
      autoCapitalize="none"
      spellCheck={false}
      prefix={`${siteHost}/@`}
      suffix={badge}
      error={invalid ?? (status === "taken" ? "Someone already has this one. Try a variation." : null)}
      hint="3–20 characters: letters, numbers, dots and underscores."
    />
  );
}

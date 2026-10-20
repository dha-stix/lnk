/** Shown in place of sign-in buttons until Firebase keys are added. */
export function SetupNotice() {
  return (
    <div role="status" className="rounded-2xl border-2 border-dashed border-ink bg-lime-soft p-4 text-sm leading-relaxed">
      <strong className="block text-base">Firebase isn&apos;t connected yet</strong>
      Copy <code className="font-mono">.env.example</code> to <code className="font-mono">.env.local</code>, add your Firebase web app keys, then restart the dev server.
    </div>
  );
}

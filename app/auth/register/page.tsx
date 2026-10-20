import type { Metadata } from "next";
import { Suspense } from "react";
import { RegisterAside } from "@/components/auth/AuthAsides";
import { AuthShell } from "@/components/auth/AuthShell";
import { RegisterForm } from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Create your page" };

export default function RegisterPage() {
  return (
    <AuthShell aside={<RegisterAside />} asideSide="left" asideClassName="bg-violet">
      <Suspense fallback={<div className="skeleton h-80 rounded-2xl" />}>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}

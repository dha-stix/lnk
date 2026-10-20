import type { Metadata } from "next";
import { LoginAside } from "@/components/auth/AuthAsides";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <AuthShell aside={<LoginAside />} asideClassName="bg-lime">
      <LoginForm />
    </AuthShell>
  );
}

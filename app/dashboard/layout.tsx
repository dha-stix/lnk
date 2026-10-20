import type { Metadata } from "next";
import { DashboardGate } from "@/components/dashboard/DashboardGate";

// Pages render only after the client-side auth check, so they can't be part of
// an instant (prefetched) navigation shell.
export const instant = false;

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s · Lnk dashboard" },
  robots: { index: false },
};

export default function DashboardLayout({ children }: LayoutProps<"/dashboard">) {
  return <DashboardGate>{children}</DashboardGate>;
}

import type { Metadata, Viewport } from "next";
import { Fraunces, Funnel_Sans, Space_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const funnel = Funnel_Sans({ variable: "--font-funnel", subsets: ["latin"] });
const fraunces = Fraunces({ variable: "--font-fraunces", subsets: ["latin"], weight: ["600"] });
const spaceMono = Space_Mono({ variable: "--font-space-mono", subsets: ["latin"], weight: ["400", "700"] });
// Isometra isn't in next/font's Google list yet, so it's self-hosted.
const isometra = localFont({
  variable: "--font-isometra",
  src: "../styles/fonts/Isometra-Regular.ttf",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Lnk · One link for everything you are", template: "%s · Lnk" },
  description:
    "Bring your Instagram, TikTok, YouTube, OnlyFans, blog and personal sites together on one page. Sign in with Google and go live in 60 seconds.",
  openGraph: { type: "website", siteName: "Lnk" },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#FAFAF7",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${funnel.variable} ${fraunces.variable} ${spaceMono.variable} ${isometra.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink antialiased">
        <AuthProvider>{children}</AuthProvider>
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: { border: "2px solid #121212", borderRadius: 16, boxShadow: "4px 4px 0 #121212", fontFamily: "var(--font-funnel)" },
          }}
        />
      </body>
    </html>
  );
}

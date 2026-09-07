import type { Metadata } from "next";
import { Space_Grotesk, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const body = Plus_Jakarta_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ),
  title: {
    default: "Braga Event — O que acontece em Braga?",
    template: "%s · Braga Event",
  },
  description:
    "Descobre concertos, festas, cultura, mercados, workshops e tudo o que está a acontecer em Braga.",
  keywords: [
    "Braga",
    "eventos em Braga",
    "o que fazer em Braga",
    "concertos Braga",
    "agenda cultural Braga",
    "festas Braga",
    "Braga Event",
  ],
  openGraph: {
    type: "website",
    locale: "pt_PT",
    siteName: "Braga Event",
    title: "Braga Event — O que acontece em Braga?",
    description:
      "Descobre concertos, festas, cultura, mercados, workshops e tudo o que está a acontecer em Braga.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Braga Event — O que acontece em Braga?",
    description:
      "Descobre concertos, festas, cultura, mercados, workshops e tudo o que está a acontecer em Braga.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="pt-PT"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-cream text-ink">
        {children}
      </body>
    </html>
  );
}

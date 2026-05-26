import type { Metadata } from "next";
import { Inter, Fraunces, Caveat } from "next/font/google";
import "./globals.css";

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const hand = Caveat({
  subsets: ["latin"],
  variable: "--font-hand",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://earlyfounderscollective.com"),
  title: {
    default:
      "Early Founders Collective — A Private Community for Early-Stage Builders",
    template: "%s · Early Founders Collective",
  },
  description:
    "Grow your business with more clarity, consistency, and momentum over the next 180 days. A private community for early-stage business owners built around structure, accountability, and execution.",
  openGraph: {
    type: "website",
    siteName: "Early Founders Collective",
    title:
      "Early Founders Collective — A Private Community for Early-Stage Builders",
    description:
      "Grow your business with more clarity, consistency, and momentum over the next 180 days. A private community for early-stage business owners built around structure, accountability, and execution.",
    url: "https://earlyfounderscollective.com",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Early Founders Collective — A Private Community for Early-Stage Builders",
    description:
      "Grow your business with more clarity, consistency, and momentum over the next 180 days.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${hand.variable}`}
    >
      <body className="font-sans antialiased text-ink bg-ivory selection:bg-forest selection:text-ivory">
        {children}
      </body>
    </html>
  );
}

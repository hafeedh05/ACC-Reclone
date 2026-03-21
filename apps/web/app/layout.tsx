import type { Metadata } from "next";
import Script from "next/script";
import {
  IBM_Plex_Mono,
  Instrument_Sans,
  Instrument_Serif,
} from "next/font/google";
import "./globals.css";
import { WebVitals } from "@/components/web-vitals";
import { siteUrl } from "./seo";

const instrumentSans = Instrument_Sans({
  variable: "--font-ui",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-editorial",
  weight: ["400"],
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Ad Command Center",
    template: "%s | Ad Command Center",
  },
  description: "A premium production system for turning a brief into campaign-ready ad variants.",
  applicationName: "Ad Command Center",
  metadataBase: new URL(siteUrl),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSans.variable} ${instrumentSerif.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[color:var(--bg-canvas)] text-[color:var(--text-primary)]">
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <WebVitals />
        {children}
      </body>
      {process.env.NODE_ENV === "development" ? (
        <Script src="https://mcp.figma.com/mcp/html-to-design/capture.js" strategy="afterInteractive" />
      ) : null}
    </html>
  );
}

import type { Metadata } from "next";
import { Schibsted_Grotesk, Work_Sans } from "next/font/google";
import "./globals.css";

// The homepage's two faces, for the whole site: Schibsted for anything you'd shout, Work Sans to read.
const display = Schibsted_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
  display: "swap",
  variable: "--font-schibsted",
});
const text = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-work-sans",
});

export const metadata: Metadata = {
  title: {
    default: "CivicVibe",
    template: "%s | CivicVibe",
  },
  description:
    "Everyone in government tech who yearns for digital transformation but has hit the wall too many times, I'm gonna help you make a door.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "CivicVibe",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}

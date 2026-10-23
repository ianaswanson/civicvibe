import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
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
    <html lang="en" className={inter.variable}>
      <body className="font-sans">{children}</body>
    </html>
  );
}

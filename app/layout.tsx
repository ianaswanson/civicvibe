import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "CivicVibe - Digital Transformation for Local Government",
    template: "%s | CivicVibe",
  },
  description:
    "Free, open-source resources helping local government teams harness AI and digital transformation. Ideas, tactics, tools, and software for civic innovation.",
  keywords: [
    "government digital transformation",
    "civic technology",
    "local government AI",
    "open source government",
    "civic innovation",
    "govtech",
  ],
  authors: [{ name: "CivicVibe" }],
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
      <body className="flex min-h-screen flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

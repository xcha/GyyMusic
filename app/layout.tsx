import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "@/components/ui/button.tsx";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "冈易云音乐",
  description: "恋次基于 Next.js 16.1.1 构建的仿网易云音乐",
};

import Header from "@/components/layout/Header";
import { PlayerBar } from "@/components/layout/PlayerBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="referrer" content="no-referrer" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased pb-16 pt-16`}
      >
        <Header />
        <main className="min-h-[calc(100vh-120px)]">{children}</main>
        <PlayerBar />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "sanitize.css";
import "sanitize.css/forms.css";
import "sanitize.css/typography.css";
import "sanitize.css/assets.css";
import "./globals.css";
import "sanitize.css/reduce-motion.css";
import "./rubbery.css";

import { ScrollListener } from "@/components/global/scroll-listener";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Juji | Web Developer",
  description: "Welcome to my portfolio website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
        <ScrollListener />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "sanitize.css";
import "sanitize.css/forms.css";
import "sanitize.css/typography.css";
import "sanitize.css/assets.css";
import "./globals.css";
import "sanitize.css/reduce-motion.css";
import "./rubbery.css";

import { ScrollListener } from "@/components/global/scroll-listener";
import { VersionPrinter } from "@/components/global/version-printer";
import { Header } from "@/components/header";

const inter = Inter({
  variable: "--font-inter",
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
      <body className={`${inter.variable}`}>
        <Header />
        {children}
        <ScrollListener />
        <VersionPrinter />
      </body>
    </html>
  );
}

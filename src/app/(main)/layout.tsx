import type { Metadata } from "next";

import { Footer } from "@/components/footer";
import { ScrollListener } from "@/components/global/scroll-listener";
import { VersionPrinter } from "@/components/global/version-printer";
import { Header } from "@/components/header";

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
    <>
      <Header />
      {children}
      <Footer />
      <ScrollListener />
      <VersionPrinter />
    </>
  );
}

import type { Metadata } from "next";
import { Cormorant_Garamond, Outfit } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["600", "700"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "TourismBF — Découvrez le Burkina Faso",
  description: "Plateforme de promotion touristique du Burkina Faso",
};

import RootLayoutClient from "@/components/RootLayoutClient";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <RootLayoutClient cormorantVar={cormorant.variable} outfitVar={outfit.variable}>
      {children}
    </RootLayoutClient>
  );
}

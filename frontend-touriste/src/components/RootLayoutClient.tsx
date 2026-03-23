'use client';
import { useState, useEffect } from "react";
import { useThemeStore } from "@/lib/theme";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function RootLayoutClient({ 
  children,
  cormorantVar,
  outfitVar
}: { 
  children: React.ReactNode;
  cormorantVar: string;
  outfitVar: string;
}) {
  const { theme } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <html lang="fr" suppressHydrationWarning className={mounted && theme === 'dark' ? 'dark' : ''}>
      <body className={`${cormorantVar} ${outfitVar} antialiased`}>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 400px)' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

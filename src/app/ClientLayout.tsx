"use client";
import { ReactNode, useState } from "react";
import { MobileMenuContext } from "@/components/layout/MobileMenuContext";
import Header from "@/components/layout/Header";
import dynamic from "next/dynamic";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

const MobileMenuOverlay = dynamic(() => import("@/components/layout/MobileMenuOverlay"), { ssr: false });

export default function ClientLayout({ children }: { children: ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  return (
    <AuthProvider>
      <MobileMenuContext.Provider value={{ isMenuOpen, setIsMenuOpen }}>
        <div className="flex flex-col min-h-screen">
          <Header />
          <MobileMenuOverlay />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </MobileMenuContext.Provider>
    </AuthProvider>
  );
}

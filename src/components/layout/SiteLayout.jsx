import React from "react";
import { useLocation } from "@/lib/navigation";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";
import ShortlistBar from "@/components/layout/ShortlistBar";

export default function SiteLayout({ children }) {
  const { pathname } = useLocation();
  const hideBar = pathname === "/selected" || pathname.startsWith("/onboarding") || pathname.startsWith("/profile/edit");
  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-foreground focus:px-4 focus:py-2 focus:text-background">
        К содержанию
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      {!hideBar && <ShortlistBar />}
    </div>
  );
}
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePageMeta } from "@/hooks/usePageMeta";
import SiteHeader from "@/components/layout/SiteHeader";
import Hero from "@/components/home/Hero";
import DiscoveryPreview from "@/components/home/DiscoveryPreview";
import PortfolioShowcase from "@/components/home/PortfolioShowcase";
import CtaBlock from "@/components/home/CtaBlock";
import SiteFooter from "@/components/layout/SiteFooter";

export default function Home() {
  usePageMeta(null);
  const { hash } = useLocation();
  useEffect(() => {
    if (!hash) return;
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" }), 80);
    return () => clearTimeout(t);
  }, [hash]);

  return (
    <>
      <SiteHeader />
      <Hero />
      <DiscoveryPreview />
      <PortfolioShowcase />
      <CtaBlock />
      <SiteFooter />
    </>
  );
}
import React from "react";
import { usePageMeta } from "@/hooks/usePageMeta";
import HowItWorksSection from "@/components/home/HowItWorks";

export default function HowItWorks() {
  usePageMeta("Как это работает");
  return <HowItWorksSection />;
}
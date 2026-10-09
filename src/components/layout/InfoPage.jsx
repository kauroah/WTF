import React from "react";
import { usePageMeta } from "@/hooks/usePageMeta";

export default function InfoPage({ eyebrow = "What the fashion", title, intro, children }) {
  usePageMeta(title);
  return (
    <div className="container-wtf pb-24 pt-12 md:pt-20">
      <p className="label-mono text-muted-foreground">{eyebrow}</p>
      <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.8rem,5vw,5rem)] leading-[0.94] tracking-[-0.03em]">{title}</h1>
      {intro && <p className="mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">{intro}</p>}
      <div className="mt-12 max-w-3xl">{children}</div>
    </div>
  );
}
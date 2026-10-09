import React from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

export default function AuthLayout({ eyebrow, title, subtitle, footer, children }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background px-6 py-8 font-body text-foreground md:py-10">
      <Link to="/" className="inline-block">
        <Logo height={48} />
      </Link>
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-16">
        {eyebrow && <p className="label-mono text-muted-foreground">{eyebrow}</p>}
        <h1 className="mt-4 font-display text-5xl leading-[0.95] tracking-tight md:text-6xl">{title}</h1>
        {subtitle && <p className="mt-3 text-muted-foreground">{subtitle}</p>}
        <div className="mt-10">{children}</div>
      </div>
      {footer && <p className="text-center text-sm text-muted-foreground">{footer}</p>}
    </div>
  );
}
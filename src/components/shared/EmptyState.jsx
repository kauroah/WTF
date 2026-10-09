import React from "react";

export default function EmptyState({ title, text, children }) {
  return (
    <div className="border-y border-foreground py-16 text-center md:py-24">
      <p className="font-display text-4xl italic md:text-5xl">{title}</p>
      {text && <p className="mx-auto mt-4 max-w-md text-muted-foreground">{text}</p>}
      {children && <div className="mt-8 flex flex-wrap justify-center gap-4">{children}</div>}
    </div>
  );
}
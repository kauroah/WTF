import React from "react";

export default function EditSection({ num, title, children }) {
  return (
    <section className="grid gap-8 border-t border-foreground py-12 md:grid-cols-12">
      <div className="flex items-baseline gap-4 md:col-span-4 md:block">
        <p className="label-mono">{num}</p>
        <h2 className="font-display text-4xl leading-none md:mt-3">{title}</h2>
      </div>
      <div className="md:col-span-7 md:col-start-6">{children}</div>
    </section>
  );
}
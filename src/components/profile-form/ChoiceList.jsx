import React from "react";
import { Check } from "lucide-react";
import { pad } from "@/lib/wtf";

export default function ChoiceList({ label, options, value, onChange, error }) {
  const toggle = (slug) => onChange(value.includes(slug) ? value.filter((v) => v !== slug) : [...value, slug]);
  return (
    <fieldset>
      <legend className="sr-only">{label}</legend>
      <div className="grid border-t border-foreground sm:grid-cols-2">
        {options.map((o, i) => {
          const on = value.includes(o.slug);
          return (
            <button key={o.slug} type="button" role="checkbox" aria-checked={on} onClick={() => toggle(o.slug)}
              className={`flex items-center gap-4 border-b border-foreground/20 px-3 py-4 text-left transition-colors duration-200 sm:odd:border-r ${on ? "bg-foreground text-background" : "hover:bg-surface"}`}>
              <span className="label-mono w-6 opacity-60">{pad(i + 1)}</span>
              <span className="flex-1 font-display text-2xl">{o.name}</span>
              <span className={`flex h-5 w-5 items-center justify-center border ${on ? "border-background" : "border-foreground/40"}`}>
                {on && <Check className="h-3.5 w-3.5" />}
              </span>
            </button>
          );
        })}
      </div>
      {error && <p role="alert" className="mt-3 text-sm text-danger">{error}</p>}
    </fieldset>
  );
}
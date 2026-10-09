import React from "react";

export default function OptionRow({ label, options, value, onChange }) {
  return (
    <fieldset>
      <legend className="label-mono text-muted-foreground">{label}</legend>
      <div role="radiogroup" className="mt-3 flex flex-wrap gap-2">
        {options.map((o) => {
          const on = value === o.slug;
          return (
            <button key={o.slug} type="button" role="radio" aria-checked={on} onClick={() => onChange(o.slug)}
              className={`h-11 border px-4 text-sm transition-colors ${on ? "border-foreground bg-foreground text-background" : "border-foreground/30 hover:border-foreground"}`}>
              {o.name}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
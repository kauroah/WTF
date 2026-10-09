import React from "react";
import { Check, Plus } from "lucide-react";
import { useShortlist } from "@/hooks/useShortlist";

export default function SelectButton({ profileId, name, large = false }) {
  const { has, toggle } = useShortlist();
  const selected = has(profileId);
  return (
    <button
      type="button"
      aria-pressed={selected}
      aria-label={selected ? `Убрать ${name} из выбранных` : `Выбрать ${name}`}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(profileId);
      }}
      className={`inline-flex items-center gap-2 border border-foreground uppercase tracking-[0.1em] transition-colors duration-300 ${
        large ? "h-12 px-6 text-[13px]" : "h-9 px-3 font-mono text-[11px]"
      } ${selected ? "bg-foreground text-background" : "bg-background/90 text-foreground hover:bg-foreground hover:text-background"}`}
    >
      {selected ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
      {selected ? "Выбрано" : "Выбрать"}
    </button>
  );
}
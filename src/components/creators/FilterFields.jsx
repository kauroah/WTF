import React from "react";
import { CITIES, ROLES, SPECIALIZATIONS } from "@/lib/wtf";

const SELECTS = [
  { key: "role", label: "Роль", all: "Все роли", options: ROLES },
  { key: "city", label: "Город", all: "Все города", options: CITIES },
  { key: "specialization", label: "Направление", all: "Все направления", options: SPECIALIZATIONS },
];

export default function FilterFields({ params, setParam, idPrefix }) {
  return (
    <>
      {SELECTS.map((s) => (
        <div key={s.key} className="min-w-0">
          <label htmlFor={`${idPrefix}-${s.key}`} className="mb-2 block label-mono text-muted-foreground">
            {s.label}
          </label>
          <select
            id={`${idPrefix}-${s.key}`}
            className="h-11 w-full cursor-pointer border border-foreground/10 bg-transparent px-3 text-base text-foreground transition-colors hover:border-foreground/30 focus:border-foreground focus:outline-none"
            value={params[s.key]}
            onChange={(e) => setParam(s.key, e.target.value)}
          >
            <option value="">{s.all}</option>
            {s.options.map((o) => (
              <option key={o.slug} value={o.slug}>
                {o.name}
              </option>
            ))}
          </select>
        </div>
      ))}

      <label className="flex cursor-pointer items-center gap-3 self-end pb-2 text-sm text-foreground/80">
        <input
          type="checkbox"
          className="h-4 w-4 accent-foreground"
          checked={params.available}
          onChange={(e) => setParam("available", e.target.checked ? "1" : "")}
        />
        <span>Только доступные</span>
      </label>
    </>
  );
}
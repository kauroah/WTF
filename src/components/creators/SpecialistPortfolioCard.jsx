import React from "react";

import { Link, useLocation } from "@/lib/navigation";
import { useShortlist } from "@/hooks/useShortlist";
import { coverOf, roleNames, specNames } from "@/lib/wtf";

export default function SpecialistPortfolioCard({ profile }) {
  const location = useLocation();
  const { has, toggle } = useShortlist();
  const selected = has(profile.id);
  const href = `/creators/${profile.username}`;
  const state = { from: location.pathname + location.search };
  const roles = roleNames(profile);
  const specializations = specNames(profile);

  return (
    <article className="group mb-8 inline-block w-full break-inside-avoid md:mb-12">
      <div className="relative overflow-hidden bg-surface">
        <Link
          to={href}
          state={state}
          className="block"
          aria-label={`Открыть портфолио: ${profile.full_name}`}
        >
          <img
            src={coverOf(profile)}
            alt=""
            loading="lazy"
            decoding="async"
            className="block h-auto w-full !rounded-none grayscale-[10%] transition-[filter] duration-700 ease-out group-hover:grayscale-0 group-focus-within:grayscale-0"
          />
        </Link>

        <button
          type="button"
          aria-pressed={selected}
          aria-label={selected ? `Убрать ${profile.full_name} из выбранных` : `Добавить ${profile.full_name} в shortlist`}
          onClick={() => toggle(profile.id)}
          className="absolute bottom-0 right-0 border-l border-t border-foreground/20 bg-background/95 px-3 py-2 text-[10px] font-light uppercase tracking-[0.16em] text-foreground opacity-0 transition-opacity duration-300 hover:bg-foreground hover:text-background focus-visible:opacity-100 group-hover:opacity-100 group-focus-within:opacity-100"
        >
          {selected ? "✓ Shortlisted" : "+ Shortlist"}
        </button>
      </div>

      <div className="pt-3">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="min-w-0 font-display text-2xl leading-none">
            <Link to={href} state={state} className="hover:underline hover:underline-offset-4">
              {profile.full_name}
            </Link>
          </h2>
          {profile.city && (
            <span className="editorial-kicker shrink-0 text-[9px] text-muted-foreground">
              {profile.city}
            </span>
          )}
        </div>

        {roles.length > 0 && (
          <p className="mt-2 text-[10px] font-light uppercase tracking-[0.17em] text-foreground/80">
            {roles.join(" · ")}
          </p>
        )}

        {specializations.length > 0 && (
          <p className="mt-1 text-[10px] font-light uppercase tracking-[0.14em] text-muted-foreground">
            {specializations.join(" · ")}
          </p>
        )}
      </div>
    </article>
  );
}
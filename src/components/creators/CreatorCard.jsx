import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Image } from "@/components/ui/image";
import SelectButton from "@/components/creators/SelectButton";
import { coverOf, pad, roleNames, specNames } from "@/lib/wtf";

export default function CreatorCard({ profile, index }) {
  const location = useLocation();
  const href = `/creators/${profile.username}`;
  const state = { from: location.pathname + location.search };
  return (
    <article className="group">
      <div className="relative">
        <Link to={href} state={state} tabIndex={-1} aria-hidden="true">
          <div className="aspect-[3/4] overflow-hidden bg-surface">
            <Image
              src={coverOf(profile)}
              alt=""
              className="h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.02]"
            />
          </div>
        </Link>

        <div className="absolute right-2 top-2 md:right-3 md:top-3">
          <SelectButton profileId={profile.id} name={profile.full_name} />
        </div>
      </div>

      <div className="flex gap-3 pt-3 md:gap-3">
        <span className="label-mono pt-1 text-muted-foreground">{pad(index + 1)}</span>

        <div className="min-w-0">
          <h3 className="font-display text-[1.6rem] leading-[1] tracking-[-0.04em] md:text-[2rem]">
            <Link to={href} state={state} className="hover:underline hover:decoration-1 hover:underline-offset-4">
              {profile.full_name}
            </Link>
          </h3>

          <p className="mt-1 text-sm text-foreground/70">{roleNames(profile).join(" / ")}</p>

          <p className="label-mono mt-2 truncate text-muted-foreground">
            {profile.city} · {specNames(profile).slice(0, 2).join(", ")}
          </p>
        </div>
      </div>
    </article>
  );
}
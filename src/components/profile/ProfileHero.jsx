import React from "react";
import { Image } from "@/components/ui/image";
import { coverOf, EXPERIENCE, nameOf, roleNames, specNames } from "@/lib/wtf";

export default function ProfileHero({ profile, actions, mode = "public" }) {
  const cover = coverOf(profile);
  const statusLabel =
    profile.status === "published"
      ? "Профиль опубликован"
      : profile.status === "hidden"
        ? "Скрыт" 
        : "Черновик";

  return (
    <section className="border-b border-foreground">
      <div className="mx-auto grid max-w-[1440px] md:grid-cols-12">
        <div className="relative bg-surface md:col-span-7 md:border-r md:border-foreground">
          {cover ? (
            <Image src={cover} alt={`${profile.full_name} — обложка портфолио`} className="aspect-[4/5] w-full md:aspect-auto md:h-[min(86vh,940px)]" />
          ) : (
            <div className="flex aspect-[4/5] items-center justify-center md:aspect-auto md:h-[70vh]">
              <span className="label-mono text-muted-foreground">Нет изображения</span>
            </div>
          )}
          {mode === "public" && (
            <span className="absolute bottom-4 left-4 bg-background px-3 py-2 label-mono md:bottom-6 md:left-6">
              Selected work · 01
            </span>
          )}
        </div>
        <div className="flex flex-col px-5 py-10 md:col-span-5 md:px-10 md:py-12">
          {mode === "owner" ? (
            <div className="flex flex-wrap items-center gap-3">
              <span className="label-mono text-muted-foreground">Личный профиль</span>
              <span className="border border-foreground/20 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em]">
                {statusLabel}
              </span>
            </div>
          ) : (
            <p className="label-mono">{roleNames(profile).join(" / ")}</p>
          )}

          <h1 className="mt-5 max-w-[11ch] break-words font-display text-[clamp(3.25rem,6vw,6.5rem)] leading-[0.9] tracking-[-0.02em]">{profile.full_name}</h1>

          {mode === "owner" && (
            <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="border border-foreground/20 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-foreground">
                {profile.username || "profile"}
              </span>
              <span>{profile.city}</span>
              <span>•</span>
              <span>{profile.available ? "Доступен" : "Не ищет проекты"}</span>
            </div>
          )}

          {mode === "public" && (
            <div className="mt-8 grid grid-cols-2 border-y border-foreground/20 py-4">
              <div>
                <p className="label-mono text-muted-foreground">Город</p>
                <p className="mt-2 font-display text-2xl">{profile.city}</p>
              </div>
              <div>
                <p className="label-mono text-muted-foreground">Опыт</p>
                <p className="mt-2 font-display text-2xl">
                  {profile.experience_level ? nameOf(EXPERIENCE, profile.experience_level) : "—"}
                </p>
              </div>
              <p className="col-span-2 mt-4 label-mono flex items-center gap-2 text-muted-foreground">
                <span className={`inline-block h-1.5 w-1.5 rounded-full ${profile.available ? "bg-success" : "bg-muted-foreground"}`} />
                {profile.available ? "Открыта к новым проектам" : "Сейчас не ищет проекты"}
              </p>
            </div>
          )}

          {mode === "public" && (
            <div className="mt-8 flex items-center gap-4">
              {profile.avatar_url && (
                <Image src={profile.avatar_url} alt={`Аватар: ${profile.full_name}`} className="h-14 w-14 shrink-0 rounded-full" />
              )}
              <div>
                <p>{profile.city}</p>
                <p className="label-mono mt-1 flex items-center gap-2 text-muted-foreground">
                  <span className={`inline-block h-1.5 w-1.5 rounded-full ${profile.available ? "bg-success" : "bg-muted-foreground"}`} />
                  {profile.available ? "Доступен для проектов" : "Не ищет проекты сейчас"}
                </p>
              </div>
            </div>
          )}

          {profile.bio && <p className="mt-8 max-w-md whitespace-pre-line text-lg leading-relaxed">{profile.bio}</p>}
          <div className="mt-auto pt-12">
            <p className="label-mono text-muted-foreground">{mode === "owner" ? "Специализация" : "Направления"}</p>
            <p className="mt-2 font-display text-3xl italic leading-tight">{specNames(profile).join(", ")}</p>

            {actions && (
              <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-foreground/20 pt-5">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
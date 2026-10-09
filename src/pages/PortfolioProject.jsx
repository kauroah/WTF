import React from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { supabase } from "@/api/supabaseClient";
import { withDemoPortfolio } from "@/lib/demoPortfolios";
import { typeFromUrl } from "@/lib/uploadImage";
import { usePageMeta } from "@/hooks/usePageMeta";
import { Image } from "@/components/ui/image";
import PageSkeleton from "@/components/shared/PageSkeleton";
import EmptyState from "@/components/shared/EmptyState";

export default function PortfolioProject() {
  const { username, workIndex: workIndexParam } = useParams();
  const { data: fetchedProfile, isLoading, isError } = useQuery({
    queryKey: ["creator", username],
    enabled: Boolean(username),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .eq("status", "published")
        .maybeSingle();

      if (error) throw error;
      return data ?? null;
    },
    staleTime: 5 * 60 * 1000,
  });

  const profile = fetchedProfile ? withDemoPortfolio(fetchedProfile) : null;
  const workIndex = Number(workIndexParam) - 1;
  const item = Number.isInteger(workIndex) && workIndex >= 0
    ? profile?.portfolio?.[workIndex]
    : null;
  const gallery = item ? [item.url, ...(item.images || [])].filter(Boolean) : [];
  const isPdf = item && (item.type || typeFromUrl(item.url)) === "pdf";

  usePageMeta(item?.title ? `${item.title} — ${profile?.full_name}` : "Проект портфолио");

  if (isLoading) return <PageSkeleton />;

  if (isError || !profile || !item) {
    return (
      <div className="container-wtf py-16">
        <EmptyState
          title={isError ? "Не удалось загрузить проект" : "Проект не найден"}
          text={isError ? "Проверьте соединение и попробуйте ещё раз." : "Возможно, проект был удалён или перемещён."}
        >
          <Link to={username ? `/creators/${username}` : "/creators"} className="btn-primary">К портфолио</Link>
        </EmptyState>
      </div>
    );
  }

  const previous = workIndex > 0 ? workIndex : null;
  const next = workIndex < profile.portfolio.length - 1 ? workIndex + 2 : null;

  return (
    <div className="container-wtf pb-20 pt-6 md:pt-10">
      <Link to={`/creators/${username}`} className="label-mono inline-flex items-center gap-2 text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" />
        {profile.full_name} · портфолио
      </Link>

      <header className="grid gap-8 border-b border-foreground/20 py-10 md:grid-cols-12 md:items-end md:py-16">
        <div className="md:col-span-8">
          <p className="label-mono text-muted-foreground">Проект {String(workIndex + 1).padStart(2, "0")} <span className="px-2 text-foreground/30">/</span> {String(profile.portfolio.length).padStart(2, "0")}</p>
          <h1 className="mt-5 max-w-4xl break-words font-display text-[clamp(3rem,7vw,7rem)] leading-[0.9]">{item.title || "Без названия"}</h1>
          {item.description && <p className="mt-6 max-w-2xl font-display text-2xl leading-snug text-foreground/75 md:text-3xl">{item.description}</p>}
          {(item.demo_sample || item.demo_story) && <p className="label-mono mt-5 inline-block border border-foreground/20 px-2.5 py-1 text-muted-foreground">Демо-проект</p>}
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-4 border-t border-foreground/20 pt-5 label-mono md:col-span-4 md:grid-cols-1 md:border-l md:border-t-0 md:pl-7 md:pt-0 md:text-right">
          <span>
            <span className="block text-muted-foreground">Автор</span>
            <span className="mt-1 block text-foreground">{profile.full_name}</span>
          </span>
          {item.project_role && <span><span className="block text-muted-foreground">Роль</span><span className="mt-1 block text-foreground">{item.project_role}</span></span>}
          {item.client && <span><span className="block text-muted-foreground">Проект</span><span className="mt-1 block text-foreground">{item.client}</span></span>}
          {(item.year || profile.city) && <span><span className="block text-muted-foreground">Год · город</span><span className="mt-1 block text-foreground">{[item.year, profile.city].filter(Boolean).join(" · ")}</span></span>}
        </div>
      </header>

          {item.story && (
        <section aria-labelledby="project-story-title" className="grid gap-5 border-b border-foreground/20 py-10 md:grid-cols-12 md:gap-8 md:py-14">
          <p id="project-story-title" className="label-mono text-muted-foreground md:col-span-3">Заметка о проекте</p>
          <div className="md:col-span-7">
                <p className="font-display text-2xl leading-snug md:text-3xl">{item.story}</p>
                {item.demo_story && <p className="label-mono mt-4 text-muted-foreground">Демо-описание</p>}
          </div>
        </section>
      )}

      <section aria-label="Изображения проекта" className="pt-8 md:pt-12">
        {isPdf ? (
          <div className="h-[75vh] min-h-[480px] border border-foreground/20 bg-white">
            <iframe title={item.title || "Документ проекта"} src={item.url} className="h-full w-full" />
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-12 md:gap-6">
            {gallery.map((url, index) => (
              <figure key={`${url}-${index}`} className={index === 0 ? "md:col-span-8" : index % 3 === 1 ? "md:col-span-4 md:pt-24" : "md:col-span-6"}>
                <div className={index === 0 ? "aspect-[4/5] overflow-hidden bg-surface md:aspect-[4/3]" : "aspect-[4/5] overflow-hidden bg-surface"}>
                  <Image src={url} alt={`${item.title || "Проект"} — кадр ${index + 1}`} className="h-full w-full" />
                </div>
                <figcaption className="label-mono mt-2 text-muted-foreground">Кадр {String(index + 1).padStart(2, "0")}</figcaption>
              </figure>
            ))}
          </div>
        )}
      </section>

      {(item.tags?.length > 0 || item.credits?.length > 0) && (
        <section aria-label="Теги и команда проекта" className="mt-12 grid gap-6 border-t border-foreground/20 py-6 md:grid-cols-12">
          {item.tags?.length > 0 && <div className="md:col-span-6"><p className="label-mono text-muted-foreground">Направления</p><ul className="mt-3 flex flex-wrap gap-2">{item.tags.map((tag) => <li key={tag} className="border border-foreground/20 px-3 py-2 text-sm">{tag}</li>)}</ul></div>}
          {item.credits?.length > 0 && <div className="md:col-span-6"><p className="label-mono text-muted-foreground">Команда</p><ul className="mt-3 space-y-2">{item.credits.map((credit) => <li key={credit} className="text-sm">{credit}</li>)}</ul></div>}
        </section>
      )}

      <nav aria-label="Другие проекты" className="mt-16 flex items-center justify-between border-t border-foreground py-5">
        {previous ? (
          <Link to={`/creators/${username}/portfolio/${previous}`} className="link-underline inline-flex items-center gap-2"><ArrowLeft className="h-4 w-4" /> Предыдущий проект</Link>
        ) : <span />}
        {next ? (
          <Link to={`/creators/${username}/portfolio/${next}`} className="link-underline inline-flex items-center gap-2">Следующий проект <ArrowRight className="h-4 w-4" /></Link>
        ) : <Link to={`/creators/${username}`} className="link-underline">Все проекты</Link>}
      </nav>
    </div>
  );
}
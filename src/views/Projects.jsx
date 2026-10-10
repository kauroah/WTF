import React from "react";
import { Link, useSearchParams } from "@/lib/navigation";
import { ArrowUpRight, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/api/supabaseClient";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { CITIES, nameOf, ROLES, SPECIALIZATIONS } from "@/lib/wtf";
import { usePageMeta } from "@/hooks/usePageMeta";
import EmptyState from "@/components/shared/EmptyState";
import PageSkeleton from "@/components/shared/PageSkeleton";

const labelFor = (values, slug) => nameOf(values, slug);

export default function Projects() {
  usePageMeta("Проекты", true);
  const { data: user } = useCurrentUser();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") === "mine" ? "mine" : "open";

  const { data: projects = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["projects", tab, user?.id],
    enabled: Boolean(user?.id),
    queryFn: async () => {
      let query = supabase.from("projects").select("*").order("created_at", { ascending: false }).limit(100);
      query = tab === "mine"
        ? query.eq("owner_user_id", user.id)
        : query.eq("status", "open");
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 60 * 1000,
  });

  return (
    <div className="container-wtf pb-24 pt-10 md:pt-16">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="label-mono text-muted-foreground">Совместная работа</p>
          <h1 className="mt-4 max-w-xl font-display text-[clamp(2.8rem,5vw,4.5rem)] leading-[0.94]">Проекты</h1>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground">
            Публикуйте задачу, находите специалистов и собирайте команду.
          </p>
        </div>
        <Link to="/projects/new" className="btn-primary self-start md:self-auto">
          <Plus aria-hidden="true" /> Создать проект
        </Link>
      </div>

      <div role="tablist" className="mt-10 flex gap-8 border-b border-foreground">
        {[["open", "Открытые проекты"], ["mine", "Мои проекты"]].map(([key, label]) => (
          <button
            key={key}
            role="tab"
            type="button"
            aria-selected={tab === key}
            onClick={() => setSearchParams(key === "mine" ? { tab: "mine" } : {})}
            className={`-mb-px border-b-2 pb-3 text-[13px] uppercase tracking-[0.08em] ${tab === key ? "border-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? <PageSkeleton /> : isError ? (
        <div className="mt-10">
          <EmptyState title="Не удалось загрузить проекты" text="Проверьте соединение и попробуйте ещё раз.">
            <button type="button" onClick={() => refetch()} className="btn-primary">Повторить</button>
          </EmptyState>
        </div>
      ) : projects.length ? (
        <ul className="mt-2">
          {projects.map((project) => (
            <li key={project.id} className="grid gap-5 border-b border-foreground/20 py-7 md:grid-cols-12 md:items-center md:gap-8">
              <div className="md:col-span-7">
                <p className="label-mono text-muted-foreground">
                  {labelFor(ROLES, project.role)}{project.city ? ` · ${labelFor(CITIES, project.city)}` : ""}
                </p>
                <h2 className="mt-2 font-display text-3xl leading-tight">
                  <Link to={`/projects/${project.id}`} className="hover:underline hover:underline-offset-4">{project.title}</Link>
                </h2>
                <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">{project.brief}</p>
              </div>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground md:col-span-4">
                {project.specialization && <span>{labelFor(SPECIALIZATIONS, project.specialization)}</span>}
                {project.budget && <span>{project.budget}</span>}
                {project.status === "closed" && <span className="text-danger">Закрыт</span>}
              </div>
              <Link to={`/projects/${project.id}`} aria-label={`Открыть проект ${project.title}`} className="btn-ghost md:col-span-1 md:justify-self-end">
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10">
          <EmptyState
            title={tab === "mine" ? "У вас пока нет проектов" : "Открытых проектов пока нет"}
            text={tab === "mine" ? "Создайте проект, чтобы описать задачу и собрать команду." : "Здесь появятся проекты, которым нужны специалисты."}
          >
            {tab === "mine" && <Link to="/projects/new" className="btn-primary"><Plus aria-hidden="true" /> Создать проект</Link>}
          </EmptyState>
        </div>
      )}
    </div>
  );
}
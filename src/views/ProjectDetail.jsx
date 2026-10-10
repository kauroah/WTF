import React, { useState } from "react";
import { ArrowLeft, Check, Search, X } from "lucide-react";
import { Link, useParams } from "@/lib/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/api/supabaseClient";
import { useCurrentUser, useMyProfile } from "@/hooks/useCurrentUser";
import { CITIES, nameOf, ROLES, SPECIALIZATIONS } from "@/lib/wtf";
import { usePageMeta } from "@/hooks/usePageMeta";
import ErrorNote from "@/components/shared/ErrorNote";
import EmptyState from "@/components/shared/EmptyState";
import PageSkeleton from "@/components/shared/PageSkeleton";

const APPLICATION_STATUS = { pending: "Ожидает решения", accepted: "Принят в проект", declined: "Отклонён" };

export default function ProjectDetail() {
  const { projectId } = useParams();
  const { data: user } = useCurrentUser();
  const { profile } = useMyProfile();
  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");
  const [failure, setFailure] = useState("");

  const { data: project, isLoading: loadingProject, isError: projectError } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("id", projectId).single();
      if (error) throw error;
      return data;
    },
    enabled: Boolean(projectId),
  });

  const isOwner = Boolean(project && user?.id === project.owner_user_id);
  const { data: applications = [], isLoading: loadingApplications } = useQuery({
    queryKey: ["project-applications", projectId, user?.id, isOwner],
    enabled: Boolean(project && user?.id),
    queryFn: async () => {
      let query = supabase.from("project_applications").select("*").eq("project_id", projectId).order("created_at", { ascending: false });
      if (!isOwner) query = query.eq("applicant_user_id", user.id);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
  });

  const apply = useMutation({
    mutationFn: async () => {
      if (!profile) throw new Error("Сначала создайте профиль специалиста.");
      const { data, error } = await supabase.from("project_applications").insert({
        project_id: project.id,
        applicant_user_id: user.id,
        applicant_profile_id: profile.id,
        applicant_name: profile.full_name || user.email || "Специалист",
        applicant_username: profile.username || null,
        message: message.trim(),
      }).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      setFailure("");
      await queryClient.invalidateQueries({ queryKey: ["project-applications", projectId] });
    },
    onError: (error) => {
      console.error("Failed to apply to project:", error);
      setFailure(error.message === "Сначала создайте профиль специалиста."
        ? "Чтобы откликнуться, сначала заполните профиль специалиста."
        : "Не удалось отправить отклик. Возможно, вы уже откликались на этот проект.");
    },
  });

  const decide = useMutation({
    mutationFn: async ({ id, status }) => {
      const { data, error } = await supabase.from("project_applications").update({ status, updated_at: new Date().toISOString() }).eq("id", id).eq("project_id", project.id).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: async () => {
      setFailure("");
      await queryClient.invalidateQueries({ queryKey: ["project-applications", projectId] });
    },
    onError: (error) => {
      console.error("Failed to decide on project application:", error);
      setFailure("Не удалось сохранить решение. Попробуйте ещё раз.");
    },
  });

  usePageMeta(project?.title || "Проект", true);

  if (loadingProject) return <PageSkeleton />;
  if (projectError || !project) return <div className="container-wtf py-20"><EmptyState title="Проект не найден" text="Возможно, он был удалён или больше недоступен."><Link to="/projects" className="btn-secondary">К проектам</Link></EmptyState></div>;

  const application = applications.find((item) => item.applicant_user_id === user?.id);
  const creatorSearch = new URLSearchParams({ role: project.role });
  if (project.city) creatorSearch.set("city", project.city);
  if (project.specialization) creatorSearch.set("specialization", project.specialization);

  return (
    <div className="container-wtf pb-24 pt-10 md:pt-16">
      <Link to={isOwner ? "/projects?tab=mine" : "/projects"} className="btn-ghost"><ArrowLeft aria-hidden="true" /> Все проекты</Link>
      <div className="mt-10 grid gap-12 lg:grid-cols-12">
        <main className="lg:col-span-8">
          <p className="label-mono text-muted-foreground">
            {nameOf(ROLES, project.role)}{project.city ? ` · ${nameOf(CITIES, project.city)}` : ""}{project.status === "closed" ? " · Закрыт" : ""}
          </p>
          <h1 className="mt-4 max-w-3xl font-display text-[clamp(2.8rem,5vw,5rem)] leading-[0.94]">{project.title}</h1>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
            {project.specialization && <span>{nameOf(SPECIALIZATIONS, project.specialization)}</span>}
            {project.budget && <span>{project.budget}</span>}
          </div>
          <div className="mt-10 whitespace-pre-line border-t border-foreground/20 pt-7 text-base leading-relaxed">{project.brief}</div>

          {isOwner && (
            <div className="mt-12">
              <div className="section-head">
                <h2 className="section-head__title">Кандидаты</h2>
                <span className="section-head__meta">{applications.length}</span>
              </div>
              {loadingApplications ? <div className="skeleton h-28" aria-busy="true" /> : applications.length ? (
                <ul>
                  {applications.map((candidate) => (
                    <li key={candidate.id} className="grid gap-4 border-b border-foreground/20 py-6 sm:grid-cols-12 sm:items-start">
                      <div className="sm:col-span-4">
                        <p className="font-display text-2xl leading-tight">
                          {candidate.applicant_username
                            ? <Link to={`/creators/${candidate.applicant_username}`} className="hover:underline">{candidate.applicant_name}</Link>
                            : candidate.applicant_name}
                        </p>
                        {candidate.applicant_username && <p className="label-mono mt-2 text-muted-foreground">/{candidate.applicant_username}</p>}
                      </div>
                      <p className="whitespace-pre-line text-sm leading-relaxed sm:col-span-5">{candidate.message}</p>
                      <div className="flex flex-wrap items-center gap-3 sm:col-span-3 sm:justify-end">
                        {candidate.status === "pending" ? <>
                          <button type="button" disabled={decide.isPending} onClick={() => decide.mutate({ id: candidate.id, status: "accepted" })} className="btn-primary"><Check aria-hidden="true" /> Принять</button>
                          <button type="button" disabled={decide.isPending} onClick={() => decide.mutate({ id: candidate.id, status: "declined" })} className="btn-secondary" aria-label="Отклонить кандидата"><X aria-hidden="true" /></button>
                        </> : <span className={`label-mono ${candidate.status === "accepted" ? "text-success" : candidate.status === "declined" ? "text-danger" : ""}`}>{APPLICATION_STATUS[candidate.status]}</span>}
                      </div>
                    </li>
                  ))}
                </ul>
              ) : <p className="py-5 text-sm text-muted-foreground">Откликов пока нет. Специалисты увидят ваш проект в открытом списке.</p>}
              {failure && <ErrorNote>{failure}</ErrorNote>}
            </div>
          )}
        </main>

        <aside className="border-t border-foreground/20 pt-6 lg:col-span-4 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          {isOwner ? (
            <>
              <p className="label-mono text-muted-foreground">Поиск команды</p>
              <p className="mt-3 text-sm leading-relaxed">Смотрите специалистов по роли, городу и направлению из этого брифа.</p>
              <Link to={`/creators?${creatorSearch.toString()}`} className="btn-primary mt-5"><Search aria-hidden="true" /> Найти специалистов</Link>
            </>
          ) : project.status === "open" ? (
            <>
              <p className="label-mono text-muted-foreground">Хотите участвовать?</p>
              {application ? (
                <div className="mt-4 border-l-2 border-foreground pl-4">
                  <p className="label-mono">{APPLICATION_STATUS[application.status]}</p>
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed">{application.message}</p>
                </div>
              ) : (
                <form className="mt-4" onSubmit={(event) => { event.preventDefault(); apply.mutate(); }}>
                  <label htmlFor="application-message" className="text-sm leading-relaxed">Коротко расскажите, почему вы подходите</label>
                  <textarea id="application-message" value={message} onChange={(event) => setMessage(event.target.value)} maxLength={2000} rows={5} required className="mt-3 w-full border border-foreground/20 bg-transparent p-3 text-sm leading-relaxed focus:border-foreground focus:outline-none" placeholder="Опыт, идея или ссылка на подходящую работу" />
                  <button type="submit" disabled={apply.isPending || !message.trim()} className="btn-primary mt-4 w-full"><Check aria-hidden="true" /> {apply.isPending ? "Отправляем…" : "Откликнуться"}</button>
                </form>
              )}
              {failure && <ErrorNote>{failure}</ErrorNote>}
            </>
          ) : <p className="label-mono text-muted-foreground">Проект больше не принимает отклики</p>}
        </aside>
      </div>
    </div>
  );
}
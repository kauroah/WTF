import React, { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";
import { Link, useNavigate } from "@/lib/navigation";
import { useMutation } from "@tanstack/react-query";

import { supabase } from "@/api/supabaseClient";
import { useCurrentUser, useMyProfile } from "@/hooks/useCurrentUser";
import { CITIES, ROLES, SPECIALIZATIONS } from "@/lib/wtf";
import { usePageMeta } from "@/hooks/usePageMeta";
import ErrorNote from "@/components/shared/ErrorNote";

export default function ProjectCreate() {
  usePageMeta("Создать проект", true);
  const navigate = useNavigate();
  const { data: user } = useCurrentUser();
  const { profile } = useMyProfile();
  const [error, setError] = useState("");
  const [form, setForm] = useState({ title: "", brief: "", role: "", specialization: "", city: "", budget: "" });

  const createProject = useMutation({
    mutationFn: async () => {
      const { data, error: insertError } = await supabase.from("projects").insert({
        owner_user_id: user.id,
        owner_profile_id: profile?.id ?? null,
        title: form.title.trim(),
        brief: form.brief.trim(),
        role: form.role,
        specialization: form.specialization || null,
        city: form.city || null,
        budget: form.budget.trim() || null,
      }).select("id").single();
      if (insertError) throw insertError;
      return data;
    },
    onSuccess: (project) => navigate(`/projects/${project.id}`),
    onError: (insertError) => {
      console.error("Failed to create project:", insertError);
      setError("Не удалось создать проект. Проверьте соединение и попробуйте ещё раз.");
    },
  });

  const update = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    setError("");
    if (!form.title.trim() || !form.brief.trim() || !form.role) {
      setError("Заполните название, описание и нужную роль специалиста.");
      return;
    }
    if (form.title.trim().length > 120 || form.brief.trim().length > 4000 || form.budget.trim().length > 100) {
      setError("Название: до 120 символов, описание: до 4000, бюджет: до 100.");
      return;
    }
    createProject.mutate();
  };

  return (
    <div className="container-narrow pb-24 pt-10 md:pt-16">
      <Link to="/projects" className="btn-ghost"><ArrowLeft aria-hidden="true" /> Все проекты</Link>
      <p className="label-mono mt-10 text-muted-foreground">Новый бриф</p>
      <h1 className="mt-3 font-display text-5xl leading-[0.95]">Создать проект</h1>
      <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">Расскажите, что нужно сделать и кого вы ищете. Специалисты смогут откликнуться на открытый проект.</p>

      <form onSubmit={submit} className="mt-10">
        <label htmlFor="project-title" className="label-mono text-muted-foreground">Название проекта</label>
        <input id="project-title" className="field-input mt-1" value={form.title} onChange={update("title")} maxLength={120} required placeholder="Например, съёмка новой коллекции" />

        <label htmlFor="project-brief" className="label-mono mt-8 block text-muted-foreground">О проекте и задачах</label>
        <textarea id="project-brief" className="mt-2 min-h-40 w-full resize-y border border-foreground/20 bg-transparent p-3 text-base leading-relaxed focus:border-foreground focus:outline-none" value={form.brief} onChange={update("brief")} maxLength={4000} required placeholder="Цель, формат, сроки, ожидаемый результат…" />

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="project-role" className="label-mono text-muted-foreground">Кого ищете</label>
            <select id="project-role" className="mt-2 h-12 w-full border border-foreground/20 bg-background px-3" value={form.role} onChange={update("role")} required>
              <option value="">Выберите роль</option>
              {ROLES.filter((role) => role.slug !== "brand").map((role) => <option key={role.slug} value={role.slug}>{role.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="project-specialization" className="label-mono text-muted-foreground">Направление</label>
            <select id="project-specialization" className="mt-2 h-12 w-full border border-foreground/20 bg-background px-3" value={form.specialization} onChange={update("specialization")}>
              <option value="">Любое направление</option>
              {SPECIALIZATIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="project-city" className="label-mono text-muted-foreground">Город</label>
            <select id="project-city" className="mt-2 h-12 w-full border border-foreground/20 bg-background px-3" value={form.city} onChange={update("city")}>
              <option value="">Любой / удалённо</option>
              {CITIES.map((city) => <option key={city.slug} value={city.slug}>{city.name}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="project-budget" className="label-mono text-muted-foreground">Бюджет</label>
            <input id="project-budget" className="field-input mt-1" value={form.budget} onChange={update("budget")} maxLength={100} placeholder="Например, 30 000 ₽" />
          </div>
        </div>

        {error && <ErrorNote>{error}</ErrorNote>}
        <div className="mt-10 flex flex-wrap gap-3">
          <button type="submit" className="btn-primary" disabled={createProject.isPending}>
            <Save aria-hidden="true" /> {createProject.isPending ? "Публикуем…" : "Опубликовать проект"}
          </button>
          <Link to="/projects" className="btn-secondary">Отмена</Link>
        </div>
      </form>
    </div>
  );
}
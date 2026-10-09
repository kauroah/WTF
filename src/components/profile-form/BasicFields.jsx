import React from "react";
import Field from "@/components/profile-form/Field";
import { CITIES } from "@/lib/wtf";

export default function BasicFields({ form, set, errors }) {
  return (
    <div className="space-y-10">
      <Field label="Имя и фамилия" htmlFor="full_name" error={errors.full_name}>
        <input id="full_name" className="field-input" autoComplete="name" placeholder="Анна Петрова"
          value={form.full_name} onChange={(e) => set({ full_name: e.target.value })} aria-invalid={!!errors.full_name} />
      </Field>
      <Field label="Username" htmlFor="username" error={errors.username} hint="Адрес вашей страницы. Латиница, цифры и дефис.">
        <div className="flex items-baseline border-b border-foreground/30 transition-colors focus-within:border-foreground">
          <span className="whitespace-nowrap text-lg text-muted-foreground">/creators/</span>
          <input id="username" className="field-input border-0" maxLength={30} placeholder="anna-petrova" aria-invalid={!!errors.username}
            value={form.username} onChange={(e) => set({ username: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "") })} />
        </div>
      </Field>
      <Field label="Город" htmlFor="city" error={errors.city}>
        <select id="city" className="field-input cursor-pointer" value={form.city} onChange={(e) => set({ city: e.target.value })} aria-invalid={!!errors.city}>
          <option value="">Выберите город</option>
          {CITIES.map((c) => <option key={c.slug} value={c.name}>{c.name}</option>)}
        </select>
      </Field>
    </div>
  );
}
import React from "react";
import Field from "@/components/profile-form/Field";
import OptionRow from "@/components/profile-form/OptionRow";
import { EXPERIENCE } from "@/lib/wtf";

const AVAILABILITY = [
  { slug: "yes", name: "Доступен для проектов" },
  { slug: "no", name: "Не ищу проекты сейчас" },
];

export default function AboutFields({ form, set, errors }) {
  return (
    <div className="space-y-10">
      <Field label="Био" htmlFor="bio" error={errors.bio} hint={`${form.bio.length} / 600`}>
        <textarea id="bio" rows={5} className="field-input resize-none leading-relaxed" value={form.bio}
          placeholder="Снимаю fashion и editorial. Люблю естественный свет и честные образы."
          onChange={(e) => set({ bio: e.target.value })} aria-invalid={!!errors.bio} />
      </Field>
      <OptionRow label="Опыт" options={EXPERIENCE} value={form.experience_level} onChange={(v) => set({ experience_level: v })} />
      <OptionRow label="Доступность" options={AVAILABILITY} value={form.available ? "yes" : "no"} onChange={(v) => set({ available: v === "yes" })} />
    </div>
  );
}
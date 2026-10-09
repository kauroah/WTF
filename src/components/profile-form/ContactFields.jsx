import React from "react";
import Field from "@/components/profile-form/Field";

const CONTACTS = [
  { key: "telegram", label: "Telegram", placeholder: "@username" },
  { key: "instagram", label: "Instagram", placeholder: "@username" },
  { key: "website", label: "Сайт", placeholder: "portfolio.ru" },
];

export default function ContactFields({ form, set, errors }) {
  return (
    <div className="space-y-10">
      {CONTACTS.map((c) => (
        <Field key={c.key} label={c.label} htmlFor={c.key} error={errors[c.key]}>
          <input id={c.key} className="field-input" placeholder={c.placeholder} value={form[c.key]}
            onChange={(e) => set({ [c.key]: e.target.value })} aria-invalid={!!errors[c.key]} />
        </Field>
      ))}
    </div>
  );
}
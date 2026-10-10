import React, { useState } from "react";
import { Link, useNavigate } from "@/lib/navigation";
import { Eye, Save } from "lucide-react";
import { useProfileSave } from "@/hooks/useProfileSave";
import { toForm, toRecord, validateAllAsync } from "@/lib/profileForm";
import { ROLES, SPECIALIZATIONS } from "@/lib/wtf";
import EditSection from "@/components/profile/EditSection";
import ProfileView from "@/components/profile/ProfileView";
import PreviewBar from "@/components/onboarding/PreviewBar";
import BasicFields from "@/components/profile-form/BasicFields";
import ChoiceList from "@/components/profile-form/ChoiceList";
import AboutFields from "@/components/profile-form/AboutFields";
import ContactFields from "@/components/profile-form/ContactFields";
import AvatarField from "@/components/profile-form/AvatarField";
import PortfolioManager from "@/components/profile-form/PortfolioManager";
import ErrorNote from "@/components/shared/ErrorNote";

export default function ProfileEditor({ user, profile }) {
  const navigate = useNavigate();
  const save = useProfileSave();
  const [form, setForm] = useState(() => toForm(profile, user));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [failure, setFailure] = useState("");
  const [preview, setPreview] = useState(false);
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const submit = async () => {
    setSaving(true); setFailure("");
    try {
      const e = await validateAllAsync(form);
      setErrors(e);
      if (Object.keys(e).length) { setFailure("Проверьте отмеченные поля."); return; }
      await save(profile.id, toRecord(form));
      navigate("/profile");
    } catch {
      setFailure("Не удалось сохранить изменения. Попробуйте ещё раз.");
    } finally {
      setSaving(false);
    }
  };

  if (preview) {
    return (
      <>
        <PreviewBar title="Предпросмотр профиля" note="Изменения ещё не сохранены" onBack={() => setPreview(false)} backLabel="Вернуться к редактированию" />
        <ProfileView profile={form} />
      </>
    );
  }

  return (
    <div className="container-wtf pt-10 md:pt-16">
      <p className="label-mono text-muted-foreground">Мой профиль</p>
      <h1 className="mb-12 mt-4 font-display text-6xl leading-[0.92] md:text-8xl">Редактирование</h1>
      <EditSection num="01" title="Основное"><BasicFields form={form} set={set} errors={errors} /></EditSection>
      <EditSection num="02" title="Роли"><ChoiceList label="Роли" options={ROLES} value={form.roles} onChange={(roles) => set({ roles })} error={errors.roles} /></EditSection>
      <EditSection num="03" title="Направления"><ChoiceList label="Направления" options={SPECIALIZATIONS} value={form.specializations} onChange={(specializations) => set({ specializations })} error={errors.specializations} /></EditSection>
      <EditSection num="04" title="О себе"><AboutFields form={form} set={set} errors={errors} /></EditSection>
      <EditSection num="05" title="Контакты"><ContactFields form={form} set={set} errors={errors} /></EditSection>
      <EditSection num="06" title="Аватар"><AvatarField value={form.avatar_url} onChange={(avatar_url) => set({ avatar_url })} /></EditSection>
      <EditSection num="07" title="Портфолио"><PortfolioManager items={form.portfolio} onChange={(portfolio) => set({ portfolio })} error={errors.portfolio} /></EditSection>
      <div className="sticky bottom-0 z-20 -mx-5 border-t border-foreground bg-background px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] md:-mx-10 md:px-10">
        {failure && <ErrorNote>{failure}</ErrorNote>}
        <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
          <Link to="/profile" className="link-underline">Отмена</Link>
          <div className="flex items-center gap-4">
            <button type="button" onClick={() => setPreview(true)} className="btn-secondary"><Eye aria-hidden="true" />Предпросмотр</button>
            <button type="button" onClick={submit} disabled={saving} className="btn-primary"><Save aria-hidden="true" />{saving ? "Сохранение…" : "Сохранить"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
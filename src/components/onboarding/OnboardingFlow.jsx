import React, { useState } from "react";
import { useNavigate } from "@/lib/navigation";
import { ArrowRight } from "lucide-react";
import { useProfileSave } from "@/hooks/useProfileSave";
import { toForm, toRecord, validateStepAsync, validateAllAsync, firstStepWithError } from "@/lib/profileForm";
import OnboardingAside from "@/components/onboarding/OnboardingAside";
import StepFields from "@/components/onboarding/StepFields";
import PreviewBar from "@/components/onboarding/PreviewBar";
import ProfileView from "@/components/profile/ProfileView";
import ErrorNote from "@/components/shared/ErrorNote";

export default function OnboardingFlow({ user, profile }) {
  const navigate = useNavigate();
  const saveProfile = useProfileSave();
  const [form, setForm] = useState(() => toForm(profile, user));
  const [step, setStep] = useState(Math.min(profile?.onboarding_step || 1, 8));
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [failure, setFailure] = useState("");
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const goTo = (s) => { setStep(s); setErrors({}); setFailure(""); window.scrollTo({ top: 0 }); };
  const run = async (fn) => {
    setSaving(true); setFailure("");
    try { await fn(); } catch { setFailure("Не удалось сохранить. Проверьте соединение и попробуйте ещё раз."); }
    finally { setSaving(false); }
  };
  const persist = async (extra) => {
    const saved = await saveProfile(form.id, { ...toRecord(form), ...extra });
    setForm((f) => ({ ...f, id: saved?.id || f.id }));
  };

  const next = () => run(async () => {
    const e = await validateStepAsync(step, form);
    setErrors(e);
    if (Object.keys(e).length) return;
    await persist({ onboarding_step: step + 1 });
    goTo(step + 1);
  });

  const publish = () => run(async () => {
    const e = await validateAllAsync(form);
    if (Object.keys(e).length) { goTo(firstStepWithError(e)); setErrors(e); return; }
    await persist({ status: "published", onboarding_step: 8 });
    navigate(`/creators/${form.username}`);
  });

  if (step === 8) {
    return (
      <>
        <PreviewBar title="Предпросмотр профиля" note="Так профиль увидят другие" onBack={() => goTo(7)} backLabel="Назад и изменить"
          onPrimary={publish} primaryLabel="Опубликовать профиль" busy={saving} failure={failure} />
        <ProfileView profile={form} />
      </>
    );
  }

  return (
    <div className="container-wtf grid gap-12 pb-10 pt-10 md:grid-cols-12 md:pt-16">
      <OnboardingAside step={step} onJump={goTo} />
      <section className="md:col-span-7 md:col-start-6" aria-labelledby="step-title">
        <StepFields step={step} form={form} set={set} errors={errors} />
        {failure && <ErrorNote>{failure}</ErrorNote>}
        <div className="sticky bottom-0 mt-14 flex items-center justify-between border-t border-foreground bg-background py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button type="button" className="link-underline" disabled={step === 1} onClick={() => goTo(step - 1)}>Назад</button>
          <button type="button" className="btn-primary" onClick={next} disabled={saving}>
            {saving ? "Сохранение…" : step === 7 ? "К предпросмотру" : "Далее"}
            <ArrowRight aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  );
}
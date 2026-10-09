import React from "react";
import BasicFields from "@/components/profile-form/BasicFields";
import ChoiceList from "@/components/profile-form/ChoiceList";
import AboutFields from "@/components/profile-form/AboutFields";
import ContactFields from "@/components/profile-form/ContactFields";
import AvatarField from "@/components/profile-form/AvatarField";
import PortfolioManager from "@/components/profile-form/PortfolioManager";
import { ROLES, SPECIALIZATIONS } from "@/lib/wtf";

export default function StepFields({ step, form, set, errors }) {
  switch (step) {
    case 1: return <BasicFields form={form} set={set} errors={errors} />;
    case 2: return <ChoiceList label="Роли" options={ROLES} value={form.roles} onChange={(roles) => set({ roles })} error={errors.roles} />;
    case 3: return <ChoiceList label="Направления" options={SPECIALIZATIONS} value={form.specializations} onChange={(specializations) => set({ specializations })} error={errors.specializations} />;
    case 4: return <AboutFields form={form} set={set} errors={errors} />;
    case 5: return <ContactFields form={form} set={set} errors={errors} />;
    case 6: return <AvatarField value={form.avatar_url} onChange={(avatar_url) => set({ avatar_url })} />;
    default: return <PortfolioManager items={form.portfolio} onChange={(portfolio) => set({ portfolio })} error={errors.portfolio} />;
  }
}
import React from "react";
import { Link } from "@/lib/navigation";
import { useMyProfile, useRequireAuth } from "@/hooks/useCurrentUser";
import { usePageMeta } from "@/hooks/usePageMeta";
import ProfileStatusBar from "@/components/profile/ProfileStatusBar";
import ProfileView from "@/components/profile/ProfileView";
import PageSkeleton from "@/components/shared/PageSkeleton";
import EmptyState from "@/components/shared/EmptyState";

export default function MyProfile() {
  usePageMeta("Мой профиль", true);
  const { user, profile, isLoading } = useMyProfile();
  useRequireAuth(user, isLoading);
  if (isLoading || !user) return <PageSkeleton />;

  if (!profile || (profile.status === "draft" && (profile.onboarding_step || 1) < 8)) {
    return (
      <div className="container-wtf py-16">
        <EmptyState title={profile ? "Профиль не завершён" : "У вас ещё нет профиля"} text="Расскажите о себе и покажите работы — это займёт несколько минут.">
          <Link to="/onboarding" className="btn-primary">{profile ? "Продолжить заполнение" : "Создать профиль"}</Link>
          <Link to="/creators" className="btn-secondary">Смотреть специалистов</Link>
        </EmptyState>
      </div>
    );
  }

  return (
    <>
      <ProfileStatusBar profile={profile} />
      <ProfileView profile={profile} mode="owner" />
    </>
  );
}
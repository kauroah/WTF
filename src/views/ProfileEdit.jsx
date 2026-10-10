import React from "react";
import { Link, Navigate } from "@/lib/navigation";
import { useMyProfile, useRequireAuth } from "@/hooks/useCurrentUser";
import { usePageMeta } from "@/hooks/usePageMeta";
import ProfileEditor from "@/components/profile/ProfileEditor";
import PageSkeleton from "@/components/shared/PageSkeleton";
import EmptyState from "@/components/shared/EmptyState";

export default function ProfileEdit() {
  usePageMeta("Редактирование профиля", true);
  const { user, profile, isLoading } = useMyProfile();
  useRequireAuth(user, isLoading);
  if (isLoading || !user) return <PageSkeleton />;
  if (!profile) return <Navigate to="/onboarding" replace />;
  if (profile.status === "hidden") {
    return (
      <div className="container-wtf py-16">
        <EmptyState title="Профиль скрыт модерацией" text="Редактирование недоступно, пока администратор не восстановит профиль.">
          <Link to="/profile" className="btn-secondary">Мой профиль</Link>
        </EmptyState>
      </div>
    );
  }
  return <ProfileEditor user={user} profile={profile} />;
}
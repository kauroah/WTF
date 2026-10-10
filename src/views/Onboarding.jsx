import React from "react";
import { Navigate } from "@/lib/navigation";
import { useMyProfile, useRequireAuth } from "@/hooks/useCurrentUser";
import { usePageMeta } from "@/hooks/usePageMeta";
import OnboardingFlow from "@/components/onboarding/OnboardingFlow";
import PageSkeleton from "@/components/shared/PageSkeleton";

export default function Onboarding() {
  usePageMeta("Создание профиля", true);
  const { user, profile, isLoading } = useMyProfile();
  useRequireAuth(user, isLoading);
  if (isLoading || !user) return <PageSkeleton />;
  if (profile && profile.status !== "draft") return <Navigate to="/profile" replace />;
  return <OnboardingFlow user={user} profile={profile} />;
}
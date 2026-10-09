import React from "react";
import {
  Link,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";

import { supabase } from "@/api/supabaseClient";
import { roleNames } from "@/lib/wtf";
import { withDemoPortfolio } from "@/lib/demoPortfolios";
import { usePageMeta } from "@/hooks/usePageMeta";

import ProfileView from "@/components/profile/ProfileView";
import SelectButton from "@/components/creators/SelectButton";
import PageSkeleton from "@/components/shared/PageSkeleton";
import EmptyState from "@/components/shared/EmptyState";

export default function CreatorProfile() {
  const { username } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const {
    data: fetchedProfile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["creator", username],

    enabled: Boolean(username),

    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .eq("status", "published")
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data ?? null;
    },

    staleTime: 5 * 60 * 1000,
  });

  const profile = fetchedProfile ? withDemoPortfolio(fetchedProfile) : null;

  usePageMeta(
    profile
      ? `${profile.full_name} — ${
          roleNames(profile)[0] || "Специалист"
        }`
      : "Специалист"
  );

  const from = location.state?.from;

  const back = () => {
    if (from) {
      navigate(-1);
    } else {
      navigate("/creators");
    }
  };

  return (
    <>
      <div className="container-wtf border-b border-foreground/20 py-4">
        <button
          type="button"
          onClick={back}
          className="label-mono inline-flex items-center gap-2 hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />

          {from
            ? "К результатам"
            : "Все специалисты"}
        </button>
      </div>

      {isLoading ? (
        <PageSkeleton />
      ) : isError ? (
        <div className="container-wtf py-16">
          <EmptyState
            title="Не удалось загрузить профиль"
            text="Проверьте соединение и попробуйте ещё раз."
          >
            <Link
              to="/creators"
              className="btn-primary"
            >
              Все специалисты
            </Link>
          </EmptyState>
        </div>
      ) : !profile ? (
        <div className="container-wtf py-16">
          <EmptyState
            title="Профиль не найден"
            text="Возможно, он скрыт или ещё не опубликован."
          >
            <Link
              to="/creators"
              className="btn-primary"
            >
              Все специалисты
            </Link>
          </EmptyState>
        </div>
      ) : (
        <ProfileView
          profile={profile}
          actions={
            <SelectButton
              profileId={profile.id}
              name={profile.full_name}
              large
            />
          }
        />
      )}
    </>
  );
}
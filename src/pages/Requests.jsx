import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import { supabase } from "@/api/supabaseClient";
import {
  useCurrentUser,
  useRequireAuth,
} from "@/hooks/useCurrentUser";
import { usePageMeta } from "@/hooks/usePageMeta";

import RequestRow from "@/components/requests/RequestRow";
import EmptyState from "@/components/shared/EmptyState";
import ErrorNote from "@/components/shared/ErrorNote";
import PageSkeleton from "@/components/shared/PageSkeleton";

export default function Requests() {
  usePageMeta("Предложения", true);

  const {
    data: user,
    isLoading: loadingUser,
  } = useCurrentUser();

  useRequireAuth(user, loadingUser);

  const [searchParams, setSearchParams] =
    useSearchParams();

  const tab =
    searchParams.get("tab") === "sent"
      ? "sent"
      : "incoming";

  const [failure, setFailure] = useState("");

  const queryClient = useQueryClient();

  const {
    data: requests = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["requests", tab, user?.id],

    enabled: Boolean(user?.id),

    queryFn: async () => {
      let query = supabase
        .from("collaboration_requests")
        .select("*")
        .order("created_at", {
          ascending: false,
        })
        .limit(100);

      if (tab === "incoming") {
        query = query.eq(
          "receiver_user_id",
          user.id
        );
      } else {
        query = query.eq(
          "sender_user_id",
          user.id
        );
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return data ?? [];
    },

    staleTime: 60 * 1000,
  });

  const respond = useMutation({
    mutationFn: async ({ id, status }) => {
      if (!user?.id) {
        throw new Error("Authentication required.");
      }

      /**
       * Only the receiver should be able to
       * accept/reject an incoming request.
       */
      const { data, error } = await supabase
        .from("collaboration_requests")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("receiver_user_id", user.id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    },

    onSuccess: async () => {
      setFailure("");

      await queryClient.invalidateQueries({
        queryKey: ["requests"],
      });
    },

    onError: (error) => {
      console.error(
        "Failed to update collaboration request:",
        error
      );

      setFailure(
        "Не удалось сохранить ответ. Попробуйте ещё раз."
      );
    },
  });

  if (loadingUser || !user) {
    return <PageSkeleton />;
  }

  const tabs = [
    ["incoming", "Входящие"],
    ["sent", "Отправленные"],
  ];

  return (
    <div className="container-wtf pb-24 pt-10 md:pt-16">
      <p className="label-mono text-muted-foreground">
        Сотрудничество
      </p>

      <h1 className="mt-4 max-w-xl font-display text-[clamp(2.8rem,5vw,4.5rem)] leading-[0.94] tracking-[-0.03em]">
        Предложения
      </h1>

      <div
        role="tablist"
        className="mt-12 flex gap-8 border-b border-foreground"
      >
        {tabs.map(([key, label]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            type="button"
            onClick={() =>
              setSearchParams(
                key === "sent"
                  ? { tab: "sent" }
                  : {}
              )
            }
            className={`-mb-px border-b-2 pb-3 text-[13px] uppercase tracking-[0.08em] ${
              tab === key
                ? "border-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {failure && (
        <ErrorNote>
          {failure}
        </ErrorNote>
      )}

      {isLoading ? (
        <div
          className="skeleton mt-10 h-48"
          aria-busy="true"
        />
      ) : isError ? (
        <div className="mt-10">
          <EmptyState
            title="Не удалось загрузить предложения"
            text="Проверьте соединение и попробуйте ещё раз."
          >
            <button
              type="button"
              onClick={() => refetch()}
              className="btn-primary"
            >
              Повторить
            </button>
          </EmptyState>
        </div>
      ) : requests.length ? (
        <ul>
          {requests.map((request) => (
            <RequestRow
              key={request.id}
              req={request}
              incoming={tab === "incoming"}
              busy={respond.isPending}
              onRespond={(id, status) =>
                respond.mutate({
                  id,
                  status,
                })
              }
            />
          ))}
        </ul>
      ) : (
        <div className="mt-10">
          <EmptyState
            title={
              tab === "incoming"
                ? "Новых предложений пока нет"
                : "Вы ещё не отправляли предложений"
            }
            text={
              tab === "incoming"
                ? "Когда кто-то пригласит вас в проект, предложение появится здесь."
                : "Выберите специалистов в каталоге и свяжитесь с ними."
            }
          />
        </div>
      )}
    </div>
  );
}
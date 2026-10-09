import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence } from "framer-motion";

import { supabase } from "@/api/supabaseClient";
import { useShortlist } from "@/hooks/useShortlist";
import {
  useMyProfile,
  requireLogin,
} from "@/hooks/useCurrentUser";
import { usePageMeta } from "@/hooks/usePageMeta";
import {
  nameOf,
  ROLES,
  pad,
} from "@/lib/wtf";

import SelectedPersonRow from "@/components/selected/SelectedPersonRow";
import ContactForm from "@/components/selected/ContactForm";
import SentState from "@/components/selected/SentState";
import EmptyState from "@/components/shared/EmptyState";

export default function Selected() {
  usePageMeta("Выбранные специалисты", true);

  const {
    ids,
    remove,
    clear,
  } = useShortlist();

  const {
    user,
    profile: myProfile,
  } = useMyProfile();

  const [mode, setMode] = useState(() => {
    const params = new URLSearchParams(
      window.location.search
    );

    return params.get("contact") === "1"
      ? "contact"
      : "review";
  });

  const [sentCount, setSentCount] = useState(0);

  const {
    data: profiles = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["selected", ids],

    enabled: ids.length > 0,

    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .in("id", ids)
        .eq("status", "published");

      if (error) {
        throw error;
      }

      return data ?? [];
    },
  });

  /**
   * Supabase does not guarantee that rows returned by
   * .in() will be in the same order as our shortlist.
   *
   * Preserve the user's selected order manually.
   */
  const people = ids
    .map((id) =>
      profiles.find(
        (profile) => profile.id === id
      )
    )
    .filter(Boolean);

  /**
   * Do not allow users to send a collaboration
   * request to themselves.
   *
   * Base44 previously used:
   * profile.created_by_id
   *
   * Our profile schema uses:
   * profile.user_id
   */
  const recipients = people.filter(
    (profile) => profile.user_id !== user?.id
  );

  const team = [
    ...new Set(
      people
        .map(
          (profile) => profile.roles?.[0]
        )
        .filter(Boolean)
    ),
  ].map((role) => nameOf(ROLES, role));

  if (mode === "sent") {
    return (
      <SentState count={sentCount} />
    );
  }

  const contact = () => {
    if (user) {
      setMode("contact");
      return;
    }

    requireLogin("/selected?contact=1");
  };

  const onSent = (count) => {
    setSentCount(count);
    clear();
    setMode("sent");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="container-wtf pb-24 pt-10 md:pt-16">
      <p className="label-mono text-muted-foreground">
        Ваша команда — {pad(ids.length)}
      </p>

      <h1 className="mt-4 max-w-2xl font-display text-[clamp(2.8rem,5vw,4.8rem)] leading-[0.94] tracking-[-0.03em]">
        Выбранные специалисты
      </h1>

      {!ids.length ? (
        <div className="mt-14">
          <EmptyState
            title="Вы пока никого не выбрали"
            text="Отмечайте интересных людей в каталоге — они соберутся здесь."
          >
            <Link
              to="/creators"
              className="btn-primary"
            >
              Найти специалиста
            </Link>
          </EmptyState>
        </div>
      ) : (
        <div className="mt-14 grid gap-14 md:grid-cols-12">
          <div className="md:col-span-7">
            {isLoading ? (
              <div
                className="skeleton h-64"
                aria-busy="true"
              />
            ) : isError ? (
              <EmptyState
                title="Не удалось загрузить выбранных специалистов"
                text="Проверьте соединение и попробуйте ещё раз."
              />
            ) : (
              <ul className="border-t border-foreground">
                <AnimatePresence initial={false}>
                  {people.map(
                    (person, index) => (
                      <SelectedPersonRow
                        key={person.id}
                        person={person}
                        index={index}
                        onRemove={() =>
                          remove(person.id)
                        }
                      />
                    )
                  )}
                </AnimatePresence>
              </ul>
            )}

            <Link
              to="/creators"
              className="link-underline mt-8 inline-block"
            >
              + Добавить ещё
            </Link>
          </div>

          <aside className="md:col-span-4 md:col-start-9">
            <div className="md:sticky md:top-24">
              {mode === "contact" && user ? (
                <ContactForm
                  recipients={recipients}
                  user={user}
                  myProfile={myProfile}
                  onSent={onSent}
                  onBack={() =>
                    setMode("review")
                  }
                />
              ) : (
                <div className="border-t border-foreground pt-6">
                  <p className="label-mono text-muted-foreground">
                    Состав
                  </p>

                  <p className="mt-2 font-display text-3xl italic leading-tight">
                    {team.join(", ") || "—"}
                  </p>

                  <p className="mt-6 text-sm text-muted-foreground">
                    Одно сообщение — отдельное
                    предложение каждому. Получатели не
                    видят друг друга.
                  </p>

                  <button
                    type="button"
                    onClick={contact}
                    disabled={
                      !people.length ||
                      (Boolean(user) &&
                        recipients.length === 0)
                    }
                    className="btn-primary mt-8 w-full"
                  >
                    Связаться
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
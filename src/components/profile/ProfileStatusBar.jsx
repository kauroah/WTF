import React, { useState } from "react";
import { Link } from "@/lib/navigation";
import { ExternalLink, Pencil, Send } from "lucide-react";

import { useProfileSave } from "@/hooks/useProfileSave";
import { validateAllAsync } from "@/lib/profileForm";

import ErrorNote from "@/components/shared/ErrorNote";

const STATUS = {
  draft: [
    "Черновик",
    "Профиль виден только вам",
  ],

  published: [
    "Опубликован",
    "Профиль виден в каталоге",
  ],

  hidden: [
    "Скрыт модерацией",
    "Профиль скрыт администратором и не виден в каталоге",
  ],
};

export default function ProfileStatusBar({ profile }) {
  const save = useProfileSave();

  const [busy, setBusy] = useState(false);
  const [failure, setFailure] = useState("");

  const [label, note] =
    STATUS[profile.status] || STATUS.draft;

  const publish = async () => {
    if (busy) return;

    setBusy(true);
    setFailure("");

    try {
      const errors = await validateAllAsync({
        ...profile,

        bio: profile.bio || "",
        telegram: profile.telegram || "",
        instagram: profile.instagram || "",
        website: profile.website || "",
        portfolio: profile.portfolio || [],
      });

      if (Object.keys(errors).length > 0) {
        setFailure(
          "Заполните профиль полностью перед публикацией."
        );

        return;
      }

      await save(profile.id, {
        status: "published",
      });
    } catch (error) {
      console.error("Failed to publish profile:", error);

      setFailure(
        "Не удалось опубликовать. Попробуйте ещё раз."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="border-b border-foreground">
      <div className="container-wtf flex flex-col gap-5 py-6 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="label-mono text-muted-foreground">
            Мой профиль · /creators/{profile.username}
          </p>

          <p className="mt-2 font-display text-3xl leading-none">
            {label}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {note}
          </p>

          {failure && (
            <ErrorNote>
              {failure}
            </ErrorNote>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {profile.status === "published" && (
            <Link
              to={`/creators/${profile.username}`}
              className="link-underline"
            >
              <ExternalLink className="mr-2 inline h-3.5 w-3.5" aria-hidden="true" />
              Публичная страница
            </Link>
          )}

          {profile.status !== "hidden" && (
            <Link
              to="/profile/edit"
              className="btn-secondary"
            >
              <Pencil className="mr-2 inline h-3.5 w-3.5" aria-hidden="true" />
              Редактировать
            </Link>
          )}

          {profile.status === "draft" && (
            <button
              type="button"
              onClick={publish}
              disabled={busy}
              className="btn-primary"
            >
              <Send aria-hidden="true" />
              {busy
                ? "Публикация…"
                : "Опубликовать"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
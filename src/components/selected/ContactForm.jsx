import React, { useState } from "react";
import { Send } from "lucide-react";

import { supabase } from "@/api/supabaseClient";
import ErrorNote from "@/components/shared/ErrorNote";

const DEFAULT_MESSAGE =
  "Здравствуйте!\n\nМы собираем команду для fashion-съёмки в Москве и хотели бы предложить вам участие.";

export default function ContactForm({
  recipients,
  user,
  myProfile,
  onSent,
  onBack,
}) {
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    const text = message.trim();

    if (text.length < 10) {
      setError(
        "Сообщение слишком короткое — минимум 10 символов"
      );
      return;
    }

    if (text.length > 2000) {
      setError("Не более 2000 символов");
      return;
    }

    if (!user?.id) {
      setError("Необходимо войти в аккаунт.");
      return;
    }

    if (!recipients?.length) {
      setError("Выберите хотя бы одного получателя.");
      return;
    }

    setSending(true);
    setError("");

    const senderName =
      myProfile?.full_name ||
      user?.user_metadata?.full_name ||
      user?.email ||
      "Пользователь";

    const requests = recipients.map((profile) => ({
      sender_user_id: user.id,

      sender_profile_id: myProfile?.id || null,

      sender_name: senderName,

      sender_username:
        myProfile?.status === "published"
          ? myProfile.username
          : null,

      receiver_profile_id: profile.id,

      // Base44 previously used:
      // profile.created_by_id
      //
      // Our Supabase profiles table uses:
      // profile.user_id
      receiver_user_id: profile.user_id,

      receiver_name: profile.full_name,

      receiver_username: profile.username,

      message: text,

      status: "pending",
    }));

    try {
      const { error: insertError } = await supabase
        .from("collaboration_requests")
        .insert(requests);

      if (insertError) {
        throw insertError;
      }

      onSent(recipients.length);
    } catch (err) {
      console.error(
        "Failed to send collaboration requests:",
        err
      );

      setError(
        "Не удалось отправить предложения. Проверьте соединение и попробуйте ещё раз."
      );
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate>
      <p className="label-mono text-muted-foreground">
        Кому
      </p>

      <p className="mt-2 font-display text-2xl leading-snug">
        {recipients
          .map((profile) => profile.full_name)
          .join(", ")}
      </p>

      <p className="mt-2 text-sm text-muted-foreground">
        Каждый получит отдельное предложение и не увидит
        других получателей.
      </p>

      <label
        htmlFor="collab-message"
        className="label-mono mt-10 block text-muted-foreground"
      >
        Сообщение
      </label>

      <textarea
        id="collab-message"
        rows={8}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="field-input resize-none leading-relaxed"
        aria-invalid={Boolean(error)}
      />

      {error && (
        <ErrorNote>
          {error}
        </ErrorNote>
      )}

      <div className="mt-8 flex flex-wrap items-center gap-6">
        <button
          type="submit"
          disabled={sending || !recipients.length}
          className="btn-primary"
        >
          {sending
            ? "Отправка…"
            : "Отправить предложение"}
          <Send aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={onBack}
          className="link-underline"
        >
          Назад к команде
        </button>
      </div>
    </form>
  );
}
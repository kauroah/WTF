import React, { useState } from "react";
import { Link } from "react-router-dom";

import { supabase } from "@/api/supabaseClient";
import AuthLayout from "@/components/AuthLayout";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      return;
    }

    setLoading(true);

    try {
      const { error } =
        await supabase.auth.resetPasswordForEmail(
          normalizedEmail,
          {
            redirectTo: `${window.location.origin}/reset-password`,
          }
        );

      if (error) {
        console.error(
          "Password reset request failed:",
          error
        );
      }
    } catch (error) {
      console.error(
        "Password reset request failed:",
        error
      );
    } finally {
      /**
       * Always show the same response.
       *
       * We do not want to reveal whether an email
       * exists in our database.
       */
      setLoading(false);
      setSent(true);
    }
  };

  return (
    <AuthLayout
      eyebrow="Восстановление"
      title="Сброс пароля"
      subtitle="Отправим ссылку для сброса"
      footer={
        <Link
          to="/login"
          className="text-foreground underline underline-offset-4 hover:decoration-2"
        >
          ← Назад ко входу
        </Link>
      }
    >
      {sent ? (
        <p className="text-sm text-foreground">
          Если аккаунт с таким email существует, мы
          отправим ссылку для сброса пароля.
        </p>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          <div>
            <label
              htmlFor="email"
              className="label-mono text-muted-foreground"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              className="field-input"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <button
            type="submit"
            className="btn-primary w-full"
            disabled={loading}
          >
            {loading
              ? "Отправка…"
              : "Отправить ссылку"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
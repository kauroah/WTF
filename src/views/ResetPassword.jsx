import React, { useEffect, useState } from "react";
import { Link } from "@/lib/navigation";

import { supabase } from "@/api/supabaseClient";
import AuthLayout from "@/components/AuthLayout";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [checkingSession, setCheckingSession] =
    useState(true);

  const [hasRecoverySession, setHasRecoverySession] =
    useState(false);

  useEffect(() => {
    let mounted = true;

    const checkRecoverySession = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          throw sessionError;
        }

        if (mounted && session) {
          setHasRecoverySession(true);
        }
      } catch (err) {
        console.error(
          "Failed to check recovery session:",
          err
        );
      } finally {
        if (mounted) {
          setCheckingSession(false);
        }
      }
    };

    checkRecoverySession();

    /**
     * Supabase emits PASSWORD_RECOVERY when the user
     * arrives through a valid password-reset link.
     */
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (
          event === "PASSWORD_RECOVERY" &&
          session
        ) {
          setHasRecoverySession(true);
          setCheckingSession(false);
          setError("");
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!hasRecoverySession) {
      setError(
        "Сессия восстановления недействительна или истекла."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "Пароль должен содержать минимум 8 символов"
      );
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } =
        await supabase.auth.updateUser({
          password: newPassword,
        });

      if (updateError) {
        throw updateError;
      }

      /**
       * End the temporary recovery/auth session.
       * The user can now log in using the new password.
       */
      await supabase.auth.signOut();

      window.location.href = "/login";
    } catch (err) {
      console.error(
        "Password reset failed:",
        err
      );

      setError(
        err?.message ||
          "Не удалось сбросить пароль"
      );
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return (
      <AuthLayout
        eyebrow="Восстановление"
        title="Проверяем ссылку"
        subtitle="Подождите несколько секунд"
      >
        <p className="text-sm text-muted-foreground">
          Проверяем ссылку восстановления…
        </p>
      </AuthLayout>
    );
  }

  if (!hasRecoverySession) {
    return (
      <AuthLayout
        eyebrow="Ошибка"
        title="Ссылка недействительна"
        subtitle="Ссылка для сброса отсутствует, истекла или уже была использована"
        footer={
          <Link
            to="/forgot-password"
            className="text-foreground underline underline-offset-4 hover:decoration-2"
          >
            Запросить новую ссылку
          </Link>
        }
      >
        <p className="text-sm text-foreground">
          Запросите новое письмо для сброса
          пароля и перейдите по ссылке из него.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      eyebrow="Восстановление"
      title="Новый пароль"
      subtitle="Придумайте новый пароль"
    >
      {error && (
        <p
          role="alert"
          className="mb-6 border-l-2 border-danger pl-4 text-sm text-danger"
        >
          {error}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-8"
      >
        <div>
          <label
            htmlFor="password"
            className="label-mono text-muted-foreground"
          >
            Новый пароль
          </label>

          <input
            id="password"
            type="password"
            autoComplete="new-password"
            autoFocus
            placeholder="••••••••"
            className="field-input"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            minLength={8}
            required
          />
        </div>

        <div>
          <label
            htmlFor="confirm"
            className="label-mono text-muted-foreground"
          >
            Повторите пароль
          </label>

          <input
            id="confirm"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            className="field-input"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            minLength={8}
            required
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading
            ? "Сохранение…"
            : "Сбросить пароль"}
        </button>
      </form>
    </AuthLayout>
  );
}
import React, { useState } from "react";
import { Link } from "react-router-dom";

import { supabase } from "@/api/supabaseClient";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const returnTo = safeReturnTo();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const normalizedEmail = email.trim().toLowerCase();

      const { error: signInError } =
        await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

      if (signInError) {
        throw signInError;
      }

      window.location.href = returnTo;
    } catch (err) {
      console.error("Login failed:", err);

      setError(
        err?.message || "Неверный email или пароль"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);

    try {
      /**
       * OAuth requires an absolute URL.
       *
       * We send Google back to the current application,
       * preserving the page the user originally wanted.
       */
      const callbackUrl = new URL(
        "/auth/callback",
        window.location.origin
      );

      if (returnTo && returnTo !== "/") {
        callbackUrl.searchParams.set(
          "returnTo",
          returnTo
        );
      }

      const { error: oauthError } =
        await supabase.auth.signInWithOAuth({
          provider: "google",

          options: {
            redirectTo: callbackUrl.toString(),
          },
        });

      if (oauthError) {
        throw oauthError;
      }

      /**
       * Supabase redirects the browser to Google,
       * so normally execution will leave this page.
       */
    } catch (err) {
      console.error("Google login failed:", err);

      setError(
        err?.message ||
          "Не удалось войти через Google"
      );

      setGoogleLoading(false);
    }
  };

  const registerTo =
    "/register" +
    (returnTo !== "/"
      ? `?returnTo=${encodeURIComponent(returnTo)}`
      : "");

  return (
    <AuthLayout
      eyebrow="Войти"
      title="С возвращением"
      subtitle="Войдите в аккаунт, чтобы продолжить"
      footer={
        <>
          Ещё нет аккаунта?{" "}
          <Link
            to={registerTo}
            className="text-foreground underline underline-offset-4 hover:decoration-2"
          >
            Создать
          </Link>
        </>
      }
    >
      <button
        type="button"
        onClick={handleGoogle}
        disabled={loading || googleLoading}
        className="btn-secondary w-full"
      >
        <GoogleIcon className="h-5 w-5" />

        {googleLoading
          ? "Перенаправление…"
          : "Продолжить через Google"}
      </button>

      <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-[0.14em] text-muted-foreground">
        <span className="h-px flex-1 bg-foreground/20" />
        или
        <span className="h-px flex-1 bg-foreground/20" />
      </div>

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

        <div>
          <div className="flex items-center justify-between">
            <label
              htmlFor="password"
              className="label-mono text-muted-foreground"
            >
              Пароль
            </label>

            <Link
              to="/forgot-password"
              className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Забыли пароль?
            </Link>
          </div>

          <input
            id="password"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            className="field-input"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />
        </div>

        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading || googleLoading}
        >
          {loading ? "Вход…" : "Войти"}
        </button>
      </form>
    </AuthLayout>
  );
}
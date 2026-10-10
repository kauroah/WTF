import React, { useState } from "react";
import { Link } from "@/lib/navigation";

import { supabase } from "@/api/supabaseClient";
import AuthLayout from "@/components/AuthLayout";
import GoogleIcon from "@/components/GoogleIcon";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "@/components/ui/use-toast";
import { safeReturnTo } from "@/lib/authReturnTo";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] =
    useState(false);

  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const returnTo = safeReturnTo();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (password.length < 8) {
      setError("Пароль должен содержать минимум 8 символов");
      return;
    }

    const normalizedEmail = email
      .trim()
      .toLowerCase();

    setLoading(true);

    try {
      const { data, error: signUpError } =
        await supabase.auth.signUp({
          email: normalizedEmail,
          password,
        });

      if (signUpError) {
        throw signUpError;
      }

      /**
       * If email confirmation is disabled in Supabase,
       * signup may immediately return a session.
       */
      if (data?.session) {
        window.location.href = returnTo;
        return;
      }

      /**
       * Otherwise wait for the verification code.
       */
      setEmail(normalizedEmail);
      setShowOtp(true);
      setOtpCode("");
    } catch (err) {
      console.error("Registration failed:", err);

      setError(
        err?.message ||
          "Не удалось зарегистрироваться"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    if (otpCode.length !== 6) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const { data, error: verifyError } =
        await supabase.auth.verifyOtp({
          email: email.trim().toLowerCase(),
          token: otpCode,
          type: "email",
        });

      if (verifyError) {
        throw verifyError;
      }

      /**
       * verifyOtp establishes the Supabase session.
       *
       * No equivalent of:
       * base44.auth.setToken(...)
       * is required.
       */
      if (!data?.session) {
        throw new Error(
          "Не удалось создать сессию после подтверждения."
        );
      }

      window.location.href = returnTo;
    } catch (err) {
      console.error(
        "Email verification failed:",
        err
      );

      setError(
        err?.message || "Неверный или просроченный код"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");

    try {
      const { error: resendError } =
        await supabase.auth.resend({
          type: "signup",
          email: email.trim().toLowerCase(),
        });

      if (resendError) {
        throw resendError;
      }

      setOtpCode("");

      toast({
        title: "Код отправлен",
        description:
          "Проверьте почту — мы отправили новый код.",
      });
    } catch (err) {
      console.error(
        "OTP resend failed:",
        err
      );

      setError(
        err?.message ||
          "Не удалось отправить код повторно"
      );
    }
  };

  const handleGoogle = async () => {
    setError("");
    setGoogleLoading(true);

    try {
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
    } catch (err) {
      console.error(
        "Google registration failed:",
        err
      );

      setError(
        err?.message ||
          "Не удалось продолжить через Google"
      );

      setGoogleLoading(false);
    }
  };

  const loginTo =
    "/login" +
    (returnTo !== "/"
      ? `?returnTo=${encodeURIComponent(returnTo)}`
      : "");

  if (showOtp) {
    return (
      <AuthLayout
        eyebrow="Регистрация"
        title="Подтвердите почту"
        subtitle={`Мы отправили код на ${email}`}
      >
        {error && (
          <p
            role="alert"
            className="mb-6 border-l-2 border-danger pl-4 text-sm text-danger"
          >
            {error}
          </p>
        )}

        <div className="flex justify-center">
          <InputOTP
            maxLength={6}
            value={otpCode}
            onChange={setOtpCode}
            autoFocus
            autoComplete="one-time-code"
          >
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <button
          type="button"
          onClick={handleVerify}
          disabled={
            loading || otpCode.length !== 6
          }
          className="btn-primary mt-8 w-full"
        >
          {loading
            ? "Проверка…"
            : "Подтвердить"}
        </button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Не пришёл код?{" "}
          <button
            type="button"
            onClick={handleResend}
            disabled={loading}
            className="text-foreground underline underline-offset-4 hover:decoration-2 disabled:opacity-50"
          >
            Отправить снова
          </button>
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      eyebrow="Регистрация"
      title="Создать аккаунт"
      subtitle="После регистрации расскажете о себе"
      footer={
        <>
          Уже есть аккаунт?{" "}
          <Link
            to={loginTo}
            className="text-foreground underline underline-offset-4 hover:decoration-2"
          >
            Войти
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
          <label
            htmlFor="password"
            className="label-mono text-muted-foreground"
          >
            Пароль
          </label>

          <input
            id="password"
            type="password"
            autoComplete="new-password"
            placeholder="••••••••"
            className="field-input"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
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
          disabled={loading || googleLoading}
        >
          {loading
            ? "Создание…"
            : "Создать аккаунт"}
        </button>
      </form>
    </AuthLayout>
  );
}
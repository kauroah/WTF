import React from "react";
import {
  Navigate,
  useLocation,
} from "@/lib/navigation";

import { useAuth } from "@/lib/AuthContext";

export default function ProtectedRoute({
  children,
}) {
  const {
    user,
    isLoadingAuth,
  } = useAuth();

  const location = useLocation();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800"
          aria-label="Загрузка"
        />
      </div>
    );
  }

  if (!user) {
    const returnTo =
      location.pathname +
      location.search +
      location.hash;

    return (
      <Navigate
        replace
        to={`/login?returnTo=${encodeURIComponent(
          returnTo
        )}`}
      />
    );
  }

  return children;
}
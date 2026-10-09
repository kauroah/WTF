import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/api/supabaseClient";
import { useAuth } from "@/lib/AuthContext";

/**
 * Redirect the user to our own login page.
 *
 * Base44 replacement for:
 * base44.auth.redirectToLogin(...)
 */
export const requireLogin = (returnUrl) => {
  const target =
    typeof returnUrl === "string"
      ? returnUrl
      : window.location.pathname +
        window.location.search +
        window.location.hash;

  window.location.href = `/login?returnTo=${encodeURIComponent(target)}`;
};

/**
 * Current authenticated user.
 *
 * Authentication is managed by AuthContext, so we don't need
 * another request to Supabase here.
 */
export function useCurrentUser() {
  const {
    user,
    isLoadingAuth,
    authError,
    isAuthenticated,
    authChecked,
  } = useAuth();

  return {
    data: user,
    user,
    isLoading: isLoadingAuth,
    error: authError,
    isAuthenticated,
    authChecked,
  };
}

/**
 * Get the authenticated user's WTF profile.
 *
 * Supabase schema assumption:
 *
 * profiles
 * ├── id
 * ├── user_id        -> auth.users.id
 * ├── username
 * ├── status
 * └── ...
 */
export function useMyProfile() {
  const {
    data: user,
    isLoading: loadingUser,
  } = useCurrentUser();

  const profileQuery = useQuery({
    queryKey: ["my-profile", user?.id],

    enabled: Boolean(user?.id),

    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) {
        throw error;
      }

      return data ?? null;
    },

    staleTime: 5 * 60 * 1000,
  });

  return {
    user,
    profile: profileQuery.data ?? null,

    isLoading:
      loadingUser ||
      (Boolean(user) && profileQuery.isLoading),

    error: profileQuery.error,

    refetch: profileQuery.refetch,
  };
}

/**
 * Automatically redirect anonymous users to login
 * after authentication state has finished loading.
 */
export function useRequireAuth(user, isLoading) {
  useEffect(() => {
    if (!isLoading && !user) {
      requireLogin();
    }
  }, [user, isLoading]);
}
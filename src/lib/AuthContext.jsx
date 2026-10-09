import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase } from "@/api/supabaseClient";

const AuthContext = createContext(null);

const LOCAL_APP_SETTINGS = {
  id: "what-the-fashion",
  public_settings: {},
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] =
    useState(false);

  const [isLoadingAuth, setIsLoadingAuth] =
    useState(true);

  // Kept for compatibility with existing components.
  const [
    isLoadingPublicSettings,
    setIsLoadingPublicSettings,
  ] = useState(true);

  const [authError, setAuthError] =
    useState(null);

  const [authChecked, setAuthChecked] =
    useState(false);

  const [
    appPublicSettings,
    setAppPublicSettings,
  ] = useState(null);

  const syncSessionState = useCallback(
    (session) => {
      const currentUser = session?.user ?? null;

      setUser(currentUser);
      setIsAuthenticated(Boolean(currentUser));
      setAuthChecked(true);
      setIsLoadingAuth(false);
      setAuthError(null);
    },
    []
  );

  /**
   * Read the current Supabase session.
   *
   * An anonymous visitor is NOT an error.
   */
  const checkUserAuth = useCallback(async () => {
    setIsLoadingAuth(true);

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error) {
        throw error;
      }

      syncSessionState(session);
    } catch (error) {
      console.error(
        "Auth session check failed:",
        error
      );

      setUser(null);
      setIsAuthenticated(false);
      setAuthChecked(true);
      setIsLoadingAuth(false);

      setAuthError({
        type: "auth_error",
        message:
          error?.message ||
          "Failed to check authentication",
      });
    }
  }, [syncSessionState]);

  /**
   * Initialize app.
   */
  const checkAppState = useCallback(
    async () => {
      setIsLoadingPublicSettings(true);

      try {
        setAppPublicSettings(
          LOCAL_APP_SETTINGS
        );

        await checkUserAuth();
      } catch (error) {
        console.error(
          "App initialization failed:",
          error
        );

        setAuthError({
          type: "app_error",
          message:
            error?.message ||
            "Failed to initialize application",
        });
      } finally {
        setIsLoadingPublicSettings(false);
      }
    },
    [checkUserAuth]
  );

  /**
   * Logout.
   */
  const logout = useCallback(
    async (shouldRedirect = true) => {
      try {
        const { error } =
          await supabase.auth.signOut();

        if (error) {
          throw error;
        }

        setUser(null);
        setIsAuthenticated(false);
        setAuthChecked(true);
        setAuthError(null);

        if (shouldRedirect) {
          window.location.href = "/";
        }
      } catch (error) {
        console.error(
          "Logout failed:",
          error
        );

        setAuthError({
          type: "logout_failed",
          message:
            error?.message ||
            "Failed to log out",
        });
      }
    },
    []
  );

  /**
   * Redirect to our own login page.
   */
  const navigateToLogin =
    useCallback((returnTo) => {
      const target =
        typeof returnTo === "string"
          ? returnTo
          : window.location.pathname +
            window.location.search +
            window.location.hash;

      window.location.href =
        `/login?returnTo=${encodeURIComponent(
          target
        )}`;
    }, []);

  /**
   * Initial application boot.
   */
  useEffect(() => {
    checkAppState();
  }, [checkAppState]);

  /**
   * Keep React synchronized with Supabase Auth.
   */
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        syncSessionState(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [syncSessionState]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        authChecked,
        logout,
        navigateToLogin,
        checkUserAuth,
        checkAppState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
}
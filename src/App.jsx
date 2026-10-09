import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter as Router,
  Route,
  Routes,
} from "react-router-dom";

import { queryClientInstance } from "@/lib/query-client";
import {
  AuthProvider,
  useAuth,
} from "@/lib/AuthContext";

import ProtectedRoute from "@/components/ProtectedRoute";
import PageNotFound from "@/lib/PageNotFound";
import ScrollToTop from "@/components/ScrollToTop";

import SiteLayout from "@/components/layout/SiteLayout";
import SupportChatWidget from "@/components/SupportChatWidget";

// Public pages
import Home from "@/pages/Home";
import HowItWorks from "@/pages/HowItWorks";
import Faq from "@/pages/Faq";
import Careers from "@/pages/Careers";
import Partners from "@/pages/Partners";
import Ambassadors from "@/pages/Ambassadors";
import Press from "@/pages/Press";
import Contact from "@/pages/Contact";
import About from "@/pages/About";

// Creator pages
import Creators from "@/pages/Creators";
import CreatorProfile from "@/pages/CreatorProfile";
import PortfolioProject from "@/pages/PortfolioProject";
import Selected from "@/pages/Selected";

// Private account pages
import Onboarding from "@/pages/Onboarding";
import MyProfile from "@/pages/MyProfile";
import ProfileEdit from "@/pages/ProfileEdit";
import Requests from "@/pages/Requests";
import Notifications from "@/pages/Notifications";

// Authentication pages
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";

function AuthenticatedApp() {
  const {
    isLoadingAuth,
    isLoadingPublicSettings,
  } = useAuth();

  /**
   * Wait until Supabase has checked the current session
   * before rendering the application's routes.
   */
  if (
    isLoadingAuth ||
    isLoadingPublicSettings
  ) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <div
          className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-slate-800"
          aria-label="Загрузка"
        />
      </div>
    );
  }

  return (
    <Routes>
      {/* ========================================
          AUTHENTICATION
      ======================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/forgot-password"
        element={<ForgotPassword />}
      />

      <Route
        path="/reset-password"
        element={<ResetPassword />}
      />

      {/* ========================================
          HOMEPAGE
      ======================================== */}

      <Route
        path="/"
        element={<Home />}
      />

      {/* ========================================
          MAIN WEBSITE
      ======================================== */}

      <Route element={<SiteLayout />}>
        {/* Public creator catalogue */}

        <Route
          path="/creators"
          element={<Creators />}
        />

        <Route
          path="/creators/:username/portfolio/:workIndex"
          element={<PortfolioProject />}
        />

        <Route
          path="/creators/:username"
          element={<CreatorProfile />}
        />

        {/* Shortlist can be viewed without login.
            Contact action itself requires authentication. */}

        <Route
          path="/selected"
          element={<Selected />}
        />

        {/* Public informational pages */}

        <Route
          path="/how-it-works"
          element={<HowItWorks />}
        />

        <Route
          path="/faq"
          element={<Faq />}
        />

        <Route
          path="/careers"
          element={<Careers />}
        />

        <Route
          path="/partners"
          element={<Partners />}
        />

        <Route
          path="/ambassadors"
          element={<Ambassadors />}
        />

        <Route
          path="/press"
          element={<Press />}
        />

        <Route
          path="/contact"
          element={<Contact />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        {/* ========================================
            PROTECTED ROUTES
        ======================================== */}

        <Route
          path="/onboarding"
          element={
            <ProtectedRoute>
              <Onboarding />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MyProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <ProfileEdit />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/requests"
          element={
            <ProtectedRoute>
              <Requests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* ========================================
          404
      ======================================== */}

      <Route
        path="*"
        element={<PageNotFound />}
      />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <QueryClientProvider
        client={queryClientInstance}
      >
        <Router>
          <ScrollToTop />

          <AuthenticatedApp />

          <SupportChatWidget />
          <Toaster />
        </Router>
      </QueryClientProvider>
    </AuthProvider>
  );
}
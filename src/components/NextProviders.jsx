"use client";

import { QueryClientProvider } from "@tanstack/react-query";

import { Toaster } from "@/components/ui/toaster";
import ScrollToTop from "@/components/ScrollToTop";
import SupportChatWidget from "@/components/SupportChatWidget";
import { queryClientInstance } from "@/lib/query-client";
import { AuthProvider } from "@/lib/AuthContext";

export default function NextProviders({ children }) {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <ScrollToTop />
        {children}
        <SupportChatWidget />
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}
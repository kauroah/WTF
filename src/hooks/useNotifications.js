import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { supabase } from "@/api/supabaseClient";
import { useCurrentUser } from "@/hooks/useCurrentUser";

const NOTIFICATION_FIELDS = "id,recipient_user_id,actor_user_id,type,title,body,entity_type,entity_id,created_at,read_at,data";

export function notificationHref(notification) {
  const customHref = notification.data?.href;
  if (typeof customHref === "string" && customHref.startsWith("/") && !customHref.startsWith("//")) {
    return customHref;
  }

  if (notification.entity_type === "collaboration_request") {
    return notification.type === "request_received"
      ? "/profile/requests"
      : "/profile/requests?tab=sent";
  }

  return "/profile/notifications";
}

export function useNotifications() {
  const { user } = useCurrentUser();
  const queryClient = useQueryClient();
  const userId = user?.id;

  const notificationsQuery = useQuery({
    queryKey: ["notifications", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select(NOTIFICATION_FIELDS)
        .eq("recipient_user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;
      return data ?? [];
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });

  const unreadQuery = useQuery({
    queryKey: ["notifications-unread", userId],
    enabled: Boolean(userId),
    queryFn: async () => {
      const { count, error } = await supabase
        .from("notifications")
        .select("id", { count: "exact", head: true })
        .eq("recipient_user_id", userId)
        .is("read_at", null);

      if (error) throw error;
      return count ?? 0;
    },
    staleTime: 30 * 1000,
    refetchInterval: 60 * 1000,
  });

  useEffect(() => {
    if (!userId) return undefined;

    const channelId = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const channel = supabase
      .channel(`notifications:${userId}:${channelId}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "notifications",
        filter: `recipient_user_id=eq.${userId}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ["notifications", userId] });
        queryClient.invalidateQueries({ queryKey: ["notifications-unread", userId] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient, userId]);

  const markReadMutation = useMutation({
    mutationFn: async (notificationId) => {
      const { error } = await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("id", notificationId)
        .eq("recipient_user_id", userId)
        .is("read_at", null);

      if (error) throw error;
    },
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] }),
      queryClient.invalidateQueries({ queryKey: ["notifications-unread", userId] }),
    ]),
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("notifications")
        .update({ read_at: new Date().toISOString() })
        .eq("recipient_user_id", userId)
        .is("read_at", null);

      if (error) throw error;
    },
    onSuccess: () => Promise.all([
      queryClient.invalidateQueries({ queryKey: ["notifications", userId] }),
      queryClient.invalidateQueries({ queryKey: ["notifications-unread", userId] }),
    ]),
  });

  return {
    notifications: notificationsQuery.data ?? [],
    unreadCount: unreadQuery.data ?? 0,
    isLoading: notificationsQuery.isLoading || unreadQuery.isLoading,
    isError: notificationsQuery.isError || unreadQuery.isError,
    refetch: () => Promise.all([notificationsQuery.refetch(), unreadQuery.refetch()]),
    markRead: markReadMutation.mutate,
    markingRead: markReadMutation.isPending,
    markAllRead: markAllReadMutation.mutate,
    markingAllRead: markAllReadMutation.isPending,
    actionError: markReadMutation.isError || markAllReadMutation.isError,
  };
}
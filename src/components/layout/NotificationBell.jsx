import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

import { notificationHref, useNotifications } from "@/hooks/useNotifications";

function timeLabel(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return formatDistanceToNow(date, { addSuffix: true, locale: ru });
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    isLoading,
    isError,
    markRead,
    markAllRead,
    markingAllRead,
  } = useNotifications();

  return (
    <div className="relative">
      <button
        type="button"
        aria-label={unreadCount ? `Уведомления, непрочитанных: ${unreadCount}` : "Уведомления"}
        aria-expanded={open}
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
        className="relative flex h-9 w-9 items-center justify-center text-foreground transition-opacity hover:opacity-60"
      >
        <Bell size={20} strokeWidth={1.5} />
        {unreadCount > 0 && <span className="absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-foreground px-1 text-center font-mono text-[9px] leading-4 text-background">{unreadCount > 99 ? "99+" : unreadCount}</span>}
      </button>

      {open && (
        <section role="dialog" aria-label="Уведомления" className="absolute right-0 top-12 z-50 w-[min(92vw,380px)] border border-foreground/20 bg-background shadow-lg">
          <div className="flex items-center justify-between border-b border-foreground/15 px-4 py-4">
            <div>
              <p className="label-mono text-muted-foreground">Активность</p>
              <h2 className="mt-1 font-display text-2xl">Уведомления</h2>
            </div>
            {unreadCount > 0 && (
              <button type="button" onClick={() => markAllRead()} disabled={markingAllRead} className="flex h-9 w-9 items-center justify-center hover:bg-surface disabled:opacity-40" aria-label="Отметить все как прочитанные" title="Отметить все как прочитанные">
                <CheckCheck className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="max-h-[min(65vh,440px)] overflow-y-auto">
            {isLoading ? (
              <p className="px-4 py-8 text-sm text-muted-foreground">Загрузка…</p>
            ) : isError ? (
              <p className="px-4 py-8 text-sm text-danger">Не удалось загрузить уведомления.</p>
            ) : notifications.length ? (
              notifications.slice(0, 8).map((notification) => (
                <Link
                  key={notification.id}
                  to={notificationHref(notification)}
                  onClick={() => {
                    if (!notification.read_at) markRead(notification.id);
                    setOpen(false);
                  }}
                  className={`block border-b border-foreground/10 px-4 py-4 transition-colors hover:bg-surface ${notification.read_at ? "" : "bg-surface/60"}`}
                >
                  <span className="flex items-start gap-3">
                    <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${notification.read_at ? "bg-transparent" : "bg-foreground"}`} />
                    <span className="min-w-0">
                      <span className="block font-medium">{notification.title}</span>
                      {notification.body && <span className="mt-1 block line-clamp-2 text-sm leading-relaxed text-muted-foreground">{notification.body}</span>}
                      <span className="label-mono mt-2 block text-[9px] text-muted-foreground">{timeLabel(notification.created_at)}</span>
                    </span>
                  </span>
                </Link>
              ))
            ) : (
              <p className="px-4 py-8 text-sm text-muted-foreground">Пока нет уведомлений.</p>
            )}
          </div>

          <Link to="/profile/notifications" onClick={() => setOpen(false)} className="label-mono block px-4 py-4 hover:underline">
            Все уведомления
          </Link>
        </section>
      )}
    </div>
  );
}
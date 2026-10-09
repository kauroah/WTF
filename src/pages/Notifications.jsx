import React from "react";
import { Link } from "react-router-dom";
import { CheckCheck } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

import { notificationHref, useNotifications } from "@/hooks/useNotifications";
import { usePageMeta } from "@/hooks/usePageMeta";
import EmptyState from "@/components/shared/EmptyState";
import ErrorNote from "@/components/shared/ErrorNote";
import PageSkeleton from "@/components/shared/PageSkeleton";

function timeLabel(value) {
  if (!value) return "Дата не указана";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Дата не указана";
  return formatDistanceToNow(date, { addSuffix: true, locale: ru });
}

export default function Notifications() {
  usePageMeta("Уведомления", true);
  const {
    notifications,
    unreadCount,
    isLoading,
    isError,
    refetch,
    markRead,
    markAllRead,
    markingAllRead,
    actionError,
  } = useNotifications();

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="container-wtf pb-24 pt-10 md:pt-16">
      <div className="flex flex-wrap items-end justify-between gap-5 border-b border-foreground pb-6">
        <div>
          <p className="label-mono text-muted-foreground">Ваш аккаунт</p>
          <h1 className="mt-3 font-display text-5xl leading-[0.92] md:text-7xl">Уведомления</h1>
          <p className="mt-3 text-sm text-muted-foreground">{unreadCount ? `${unreadCount} непрочитанных` : "Все просмотрено"}</p>
        </div>
        {unreadCount > 0 && (
          <button type="button" onClick={() => markAllRead()} disabled={markingAllRead} className="btn-secondary">
            <CheckCheck className="h-4 w-4" />
            Отметить все прочитанными
          </button>
        )}
      </div>

      {actionError && <ErrorNote>Не удалось обновить статус уведомления. Попробуйте ещё раз.</ErrorNote>}

      {isError ? (
        <div className="mt-10">
          <EmptyState title="Не удалось загрузить уведомления" text="Проверьте соединение и попробуйте ещё раз.">
            <button type="button" onClick={() => refetch()} className="btn-primary">Повторить</button>
          </EmptyState>
        </div>
      ) : notifications.length ? (
        <ul className="mt-5 border-t border-foreground/20">
          {notifications.map((notification) => (
            <li key={notification.id} className={`border-b border-foreground/20 ${notification.read_at ? "" : "bg-surface/50"}`}>
              <Link to={notificationHref(notification)} onClick={() => { if (!notification.read_at) markRead(notification.id); }} className="grid gap-3 py-6 md:grid-cols-[1fr_180px] md:items-center md:gap-8 md:py-8">
                <span className="flex items-start gap-4">
                  <span className={`mt-2 h-2 w-2 shrink-0 rounded-full ${notification.read_at ? "bg-transparent" : "bg-foreground"}`} />
                  <span>
                    <span className="block font-display text-2xl leading-tight md:text-3xl">{notification.title}</span>
                    {notification.body && <span className="mt-2 block max-w-3xl whitespace-pre-line text-sm leading-relaxed text-muted-foreground md:text-base">{notification.body}</span>}
                  </span>
                </span>
                <span className="label-mono pl-6 text-muted-foreground md:pl-0 md:text-right">{timeLabel(notification.created_at)}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10">
          <EmptyState title="Пока нет уведомлений" text="Здесь появятся новые предложения и ответы на ваши приглашения.">
            <Link to="/creators" className="btn-primary">Найти специалистов</Link>
          </EmptyState>
        </div>
      )}
    </div>
  );
}
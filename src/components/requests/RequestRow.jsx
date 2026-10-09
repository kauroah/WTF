import React from "react";
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

const STATUS = { pending: "Ожидает ответа", accepted: "Принято", declined: "Отклонено" };

export default function RequestRow({ req, incoming, onRespond, busy }) {
  const name = incoming ? req.sender_name : req.receiver_name;
  const username = incoming ? req.sender_username : req.receiver_username;
  const timestamp = req.created_at || req.created_date;
  const parsedDate = timestamp ? new Date(timestamp) : null;
  const dateLabel = parsedDate && !Number.isNaN(parsedDate.getTime())
    ? format(parsedDate, "d MMMM yyyy", { locale: ru })
    : "Дата не указана";

  return (
    <li className="grid gap-4 border-b border-foreground/20 py-8 md:grid-cols-12 md:gap-8">
      <div className="md:col-span-3">
        <p className="label-mono text-muted-foreground">{dateLabel}</p>
        <p className="mt-2 font-display text-3xl leading-none">
          {username ? <Link to={`/creators/${username}`} className="hover:underline hover:underline-offset-4">{name}</Link> : name}
        </p>
        <p className="label-mono mt-2 text-muted-foreground">{incoming ? "Отправитель" : "Получатель"}</p>
      </div>
      <p className="whitespace-pre-line leading-relaxed md:col-span-6">{req.message}</p>
      <div className="flex flex-col items-start gap-4 md:col-span-3 md:items-end">
        <span className={`label-mono ${req.status === "accepted" ? "text-success" : req.status === "declined" ? "text-danger" : ""}`}>{STATUS[req.status]}</span>
        {incoming && req.status === "pending" && (
          <div className="flex gap-3">
            <button type="button" disabled={busy} onClick={() => onRespond(req.id, "accepted")} className="btn-primary h-10 px-4"><Check aria-hidden="true" />Принять</button>
            <button type="button" disabled={busy} onClick={() => onRespond(req.id, "declined")} className="btn-secondary h-10 px-4"><X aria-hidden="true" />Отклонить</button>
          </div>
        )}
      </div>
    </li>
  );
}
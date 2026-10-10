import React from "react";
import { Link } from "@/lib/navigation";
import InfoPage from "@/components/layout/InfoPage";

const ROLES = [
  { title: "Product Designer", team: "Product", location: "Москва / удалённо" },
  { title: "Frontend Engineer", team: "Engineering", location: "Москва / удалённо" },
  { title: "Community Manager", team: "Community", location: "Москва" },
  { title: "Marketing Lead", team: "Growth", location: "Москва / удалённо" },
];

export default function Careers() {
  return (
    <InfoPage title="Карьера" intro="Мы строим платформу для fashion-сообщества. Присоединяйтесь к команде.">
      <div className="divide-y divide-border border-y border-border">
        {ROLES.map((r) => (
          <div key={r.title} className="flex flex-col gap-1 py-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-display text-xl md:text-2xl">{r.title}</p>
              <p className="text-sm text-muted-foreground">{r.team} · {r.location}</p>
            </div>
            <Link to="/contact" className="link-underline">Откликнуться</Link>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm text-muted-foreground">Не нашли подходящую роль? Напишите нам — мы всегда рады талантам.</p>
    </InfoPage>
  );
}
import React from "react";
import { Link } from "@/lib/navigation";
import Logo from "@/components/Logo";

const SOCIAL = [
  { label: "Telegram-канал", href: "https://t.me/ndt1project" },
  { label: "Менеджер в Telegram", href: "https://t.me/iamtaeash" },
];

export default function SiteFooter() {
  return (
    <footer>
      {/* Help us improve */}
      <div className="border-t border-border bg-surface">
        <div className="container-wtf flex flex-col items-center gap-5 py-10 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <p className="font-display text-2xl md:text-3xl">Помогите нам стать лучше</p>
            <p className="mt-1 text-sm text-muted-foreground">Пройдите короткий опрос о сегодняшнем визите.</p>
          </div>
          <Link to="/contact" className="btn-primary">Начать опрос</Link>
        </div>
      </div>

      {/* main */}
      <div className="border-t border-border">
        <div className="container-wtf grid gap-12 py-14 md:grid-cols-12 md:py-16">
          <div className="md:col-span-4">
            <Logo height={64} />
            <p className="mt-5 max-w-sm text-sm text-muted-foreground">
              What the fashion — место, где fashion находит своих людей. Фотографы, модели, стилисты,
              визажисты и дизайнеры для съёмок, показов и кампаний.
            </p>
            <p className="mt-4 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Москва — Санкт-Петербург — Казань</p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:col-span-8 md:grid-cols-3">
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Помощь</p>
              <Link to="/contact" className="block text-sm hover:underline">Связаться с нами</Link>
              <Link to="/how-it-works" className="block text-sm hover:underline">Как это работает</Link>
              <Link to="/faq" className="block text-sm hover:underline">Вопросы и ответы</Link>
              <Link to="/contact" className="block text-sm hover:underline">Обратная связь</Link>
              <Link to="/creators" className="block text-sm hover:underline">Поиск специалистов</Link>
            </div>
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Информация</p>
              <Link to="/about" className="block text-sm hover:underline">О платформе</Link>
              <Link to="/careers" className="block text-sm hover:underline">Карьера</Link>
              <Link to="/partners" className="block text-sm hover:underline">Партнёрам</Link>
              <Link to="/ambassadors" className="block text-sm hover:underline">Амбассадорам</Link>
              <Link to="/press" className="block text-sm hover:underline">Пресса</Link>
            </div>
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Связаться</p>
              {SOCIAL.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="block text-sm hover:underline">{s.label}</a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* promo strip */}
      <div className="border-t border-border bg-foreground text-background">
        <div className="container-wtf py-4 text-center text-[12px] uppercase tracking-[0.12em]">
          Ваша платформа для fashion-креативов — публикуйте профиль и собирайте команду.
        </div>
      </div>

      {/* copyright */}
      <div className="container-wtf flex flex-col justify-between gap-2 py-5 text-[11px] uppercase tracking-[0.12em] text-muted-foreground sm:flex-row">
        <span>© 2026 What the fashion</span>
        <span>WTF</span>
      </div>
    </footer>
  );
}
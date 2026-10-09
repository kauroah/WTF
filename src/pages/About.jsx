import React from "react";
import { Link } from "react-router-dom";
import InfoPage from "@/components/layout/InfoPage";

export default function About() {
  return (
    <InfoPage title="О платформе" intro="What the fashion — сеть fashion-креативов, где идеи находят исполнителей.">
      <div className="space-y-10 text-base text-muted-foreground">
        <p>
          Мы запустили WTF в 2026 году, чтобы решить простую проблему: найти людей для fashion-съёмки
          было слишком долго. Фотографы, модели, стилисты, визажисты и дизайнеры были разбросаны по
          личным сообщениям и сарафанному радио. Мы собрали их в одном месте.
        </p>
        <div className="grid gap-8 border-y border-border py-8 sm:grid-cols-3">
          <div><p className="font-display text-3xl text-foreground">12+</p><p className="mt-1 text-sm">профессий в каталоге</p></div>
          <div><p className="font-display text-3xl text-foreground">3</p><p className="mt-1 text-sm">города на старте</p></div>
          <div><p className="font-display text-3xl text-foreground">2026</p><p className="mt-1 text-sm">год запуска</p></div>
        </div>
        <div>
          <p className="font-display text-2xl text-foreground">Наша миссия</p>
          <p className="mt-3">Сделать поиск команды для fashion-проектов быстрым и человечным. Без посредников и бесконечных переписок — только портфолио и прямой контакт.</p>
        </div>
        <div>
          <p className="font-display text-2xl text-foreground">Как это работает</p>
          <p className="mt-3">Создайте профиль, загрузите портфолио и отметьте специализации. Заказчики находят вас в каталоге и отправляют заявку. Вы решаете, с кем работать.</p>
        </div>
      </div>
      <div className="mt-12 flex flex-wrap gap-4">
        <Link to="/creators" className="btn-primary">Смотреть каталог</Link>
        <Link to="/how-it-works" className="btn-secondary">Как это работает</Link>
      </div>
    </InfoPage>
  );
}
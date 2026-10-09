import React from "react";
import { Link } from "react-router-dom";
import InfoPage from "@/components/layout/InfoPage";

export default function Press() {
  return (
    <InfoPage title="Пресса" intro="Материалы о платформе для СМИ и партнёров.">
      <div className="space-y-8 text-base text-muted-foreground">
        <p>What the fashion — сеть fashion-креативов: фотографов, моделей, стилистов, визажистов и дизайнеров. Платформа помогает собирать команды для съёмок, показов и кампаний.</p>
        <div className="border-y border-border py-6">
          <p className="font-display text-xl">О платформе</p>
          <p className="mt-2">Основана в 2026 году. Сообщество профессионалов из Москвы, Санкт-Петербурга и Казани.</p>
        </div>
        <p>Для пресс-запросов и материалов напишите нам.</p>
      </div>
      <Link to="/contact" className="btn-primary mt-10">Запросить материалы</Link>
    </InfoPage>
  );
}
import React from "react";
import { Link } from "react-router-dom";
import InfoPage from "@/components/layout/InfoPage";

export default function Partners() {
  return (
    <InfoPage title="Партнёрам" intro="Бренды, агентства и школы — давайте делать проекты вместе.">
      <div className="space-y-8 text-base text-muted-foreground">
        <p>Мы помогаем брендам и агентствам находить проверенных специалистов для съёмок, показов и кампаний, а учебным заведениям — показывать работы студентов и выпускников.</p>
        <ul className="space-y-3 border-y border-border py-6">
          <li>· Подбор команд под проект</li>
          <li>· Коллаборации с креаторами</li>
          <li>· Партнёрские программы и интеграции</li>
        </ul>
        <p>Расскажите о вашем проекте — подберём формат сотрудничества.</p>
      </div>
      <Link to="/contact" className="btn-primary mt-10">Связаться</Link>
    </InfoPage>
  );
}
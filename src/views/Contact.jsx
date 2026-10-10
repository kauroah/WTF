import React from "react";
import InfoPage from "@/components/layout/InfoPage";

export default function Contact() {
  return (
    <InfoPage title="Связаться с нами" intro="Вопросы, отзывы и предложения — мы на связи.">
      <div className="space-y-8 text-base text-muted-foreground">
        <p>Напишите нам, и мы ответим в течение 1–2 рабочих дней.</p>
        <div className="border-y border-border py-6">
          <p className="font-display text-xl">Отзыв о платформе</p>
          <p className="mt-2">Помогите нам стать лучше — поделитесь впечатлениями о сегодняшнем визите.</p>
          <a href="mailto:?subject=Отзыв о WTF" className="link-underline mt-4 inline-block">Начать опрос</a>
        </div>
        <div>
          <p className="font-display text-xl">Telegram</p>
          <p className="mt-2">Следите за новостями и работами креаторов в нашем канале.</p>
          <a href="https://t.me/ndt1project" target="_blank" rel="noopener noreferrer" className="link-underline mt-4 inline-block">Telegram-канал</a>
        </div>
        <div>
          <p className="font-display text-xl">Менеджер</p>
          <p className="mt-2">По вопросам сотрудничества и партнёрств.</p>
          <a href="https://t.me/iamtaeash" target="_blank" rel="noopener noreferrer" className="link-underline mt-4 inline-block">@iamtaeash</a>
        </div>
      </div>
    </InfoPage>
  );
}
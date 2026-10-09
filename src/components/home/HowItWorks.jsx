import React from "react";

const STEPS = [
  ["Ищите", "По роли, городу и направлению. Сразу видно работы, а не резюме."],
  ["Сравнивайте", "Открывайте портфолио, возвращайтесь к выдаче — фильтры сохраняются."],
  ["Выбирайте", "Отмечайте фотографа, модель, стилиста. Команда собирается по ходу поиска."],
  ["Связывайтесь", "Одно сообщение — отдельное предложение каждому. Ответы приходят в профиль."],
];

export default function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-16 border-y border-border bg-surface" aria-labelledby="how-title">
      <div className="container-wtf grid gap-12 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-4">
          <div className="md:sticky md:top-28">
            <p className="label-mono">02</p>
            <h2 id="how-title" className="mt-3 font-display text-5xl leading-[0.95] md:text-6xl">Как это работает</h2>
            <p className="mt-6 max-w-xs text-muted-foreground">Вместо чатов, пересылок и «скиньте кого-нибудь» — один понятный путь.</p>
          </div>
        </div>
        <ol className="md:col-span-7 md:col-start-6">
          {STEPS.map(([title, text], i) => (
            <li key={title} className="grid grid-cols-[64px_1fr] gap-4 border-t border-border py-8 md:grid-cols-[120px_1fr] md:py-10">
              <span className="font-display text-5xl leading-none md:text-7xl">{i + 1}</span>
              <div>
                <h3 className="font-display text-3xl md:text-4xl">{title}</h3>
                <p className="mt-2 max-w-md text-muted-foreground">{text}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
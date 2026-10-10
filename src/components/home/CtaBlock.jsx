import React from "react";
import { Link } from "@/lib/navigation";
import { Image } from "@/components/ui/image";

const IMG = "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80";

export default function CtaBlock() {
  return (
    <section className="bg-foreground text-background">
      <div className="container-wtf grid items-end gap-12 py-12 md:grid-cols-12 md:py-20">
        <div className="md:col-span-7">
          <p className="label-mono opacity-60">04 — Для специалистов</p>
          <h2 className="mt-6 font-display text-5xl leading-[0.95] md:text-7xl">
            Ваша работа должна быть видна тем, кто собирает команду.
          </h2>
          <p className="mt-8 max-w-md opacity-70">Профиль с портфолио, ролями и контактами. Публикация за несколько минут, без модерации заранее.</p>
          <Link to="/onboarding" className="mt-10 inline-flex h-12 items-center bg-background px-6 text-[12px] font-medium uppercase tracking-[0.14em] text-foreground transition-colors hover:bg-surface">
            Создать профиль
          </Link>
        </div>
        <div className="md:col-span-4 md:col-start-9">
          <Image src={IMG} alt="Fashion-образ для кампании" className="aspect-[4/5] w-full" />
        </div>
      </div>
    </section>
  );
}
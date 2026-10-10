import React from "react";
import { Link } from "@/lib/navigation";
import { requireLogin } from "@/hooks/useCurrentUser";
import { Image } from "@/components/ui/image";

const BG =
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1920&q=80";

// Inline SVG grain — kept tiny so it doesn't bloat the component.
const GRAIN =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/></svg>";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[72vh] items-end overflow-hidden bg-surface">
      {/* Background image with slow zoom */}
      <Image
        src={BG}
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover animate-[heroZoom_20s_ease-out_forwards]"
      />

      {/* Bottom-weighted vignette + top fade for the meta text */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_100%,rgba(0,0,0,0.8),transparent_65%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/40 to-transparent" />

      {/* Film grain */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{ backgroundImage: `url("${GRAIN}")` }}
      />

      {/* Top-right meta */}
      <div className="absolute right-6 top-8 z-10 hidden text-right text-[11px] uppercase tracking-[0.15em] text-white/70 md:block">
        <p className="animate-[fadeUp_0.7s_ease-out_0.4s_both]">Est. 2026</p>
        <p className="mt-1 animate-[fadeUp_0.7s_ease-out_0.5s_both]">
          Москва · Санкт-Петербург
        </p>
      </div>

      {/* Content */}
      <div className="container-wtf relative z-10 w-full pb-12 pt-16 text-white md:pb-18">
        <div className="mb-5 flex items-center gap-3 animate-[fadeUp_0.7s_ease-out_both]">
          <span className="h-px w-10 bg-white/80" aria-hidden="true" />
          <p className="label-mono text-white/80">
            Сеть fashion-креативов
          </p>
        </div>

        <h1 className="mt-0 max-w-3xl font-display text-[clamp(3.5rem,6vw,7.2rem)] leading-[0.9] tracking-[-0.06em] animate-[fadeUp_0.7s_ease-out_0.1s_both]">
          Найдите людей
          <span className="block font-light italic opacity-90">для съёмки</span>
        </h1>

        <p className="mt-6 max-w-md text-base text-white/82 md:text-lg animate-[fadeUp_0.7s_ease-out_0.2s_both]">
          Фотографы, модели, стилисты, визажисты и дизайнеры — портфолио и
          контакты в одном месте.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-5 animate-[fadeUp_0.7s_ease-out_0.3s_both]">
          <Link
            to="/creators"
            className="group inline-flex h-12 items-center gap-3 border border-white/80 bg-white/5 px-7 text-[12px] font-medium uppercase tracking-[0.14em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-white hover:bg-white hover:text-black"
          >
            Смотреть каталог
            <span
              aria-hidden
              className="transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>

          <button
            type="button"
            onClick={requireLogin}
            className="text-[12px] uppercase tracking-[0.14em] text-white/90 underline decoration-1 underline-offset-[6px] transition hover:text-white hover:decoration-2"
          >
            Создать профиль
          </button>
        </div>
      </div>
      {/* Keyframes — scoped so they don't leak into global styles */}
      <style>{`
        @keyframes heroZoom {
          from { transform: scale(1.18); }
          to   { transform: scale(1.02); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes scrollPulse {
          0%, 100% { opacity: 0.4; transform: scaleY(0.6); transform-origin: top; }
          50%      { opacity: 1;   transform: scaleY(1);   transform-origin: top; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; }
        }
      `}</style>
    </section>
  );
}
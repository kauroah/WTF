import React from "react";
import { STEPS } from "@/components/onboarding/steps";
import { pad } from "@/lib/wtf";

export default function OnboardingAside({ step, onJump }) {
  const current = STEPS[step - 1];
  return (
    <aside className="md:col-span-4">
      <p className="label-mono">Профиль · Шаг {pad(step)} / {pad(STEPS.length)}</p>
      <h1 id="step-title" className="mt-4 font-display text-6xl leading-[0.92] md:text-7xl">{current.title}</h1>
      <p className="mt-4 max-w-sm text-muted-foreground">{current.hint}</p>
      <div className="mt-8 flex gap-1" aria-hidden="true">
        {STEPS.map((s, i) => (
          <span key={s.title} className={`h-[2px] flex-1 transition-colors duration-500 ${i < step ? "bg-foreground" : "bg-foreground/15"}`} />
        ))}
      </div>
      <ol className="mt-10 hidden space-y-1 md:block">
        {STEPS.map((s, i) => (
          <li key={s.title}>
            <button type="button" disabled={i + 1 >= step} onClick={() => onJump(i + 1)}
              className={`flex gap-4 py-1 text-left ${i + 1 === step ? "text-foreground" : i + 1 < step ? "text-foreground/70 hover:text-foreground" : "text-foreground/30"}`}>
              <span className="label-mono pt-0.5">{pad(i + 1)}</span>
              <span>{s.title}</span>
            </button>
          </li>
        ))}
      </ol>
    </aside>
  );
}
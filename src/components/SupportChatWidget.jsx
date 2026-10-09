import React, { useState } from "react";
import { X } from "lucide-react";
import Logo from "@/components/Logo";

export default function SupportChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-label="Поддержка"
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-foreground bg-background text-foreground shadow-[0_16px_44px_rgba(0,0,0,0.14)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_52px_rgba(0,0,0,0.18)]"
      >
        <Logo height={40} className="h-[40px] w-[40px] object-contain" />
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[min(320px,calc(100vw-2rem))] border border-foreground bg-background shadow-[0_22px_52px_rgba(0,0,0,0.18)]">
          <div className="flex items-center justify-between border-b border-foreground/70 bg-surface px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center border border-foreground bg-background p-1.5">
                <Logo height={16} className="h-[16px] w-auto object-contain" />
              </div>
              <div>
                <p className="label-mono text-muted-foreground">Поддержка</p>
                <p className="font-display text-lg leading-none">Чат</p>
              </div>
            </div>
            <button
              type="button"
              aria-label="Закрыть поддержку"
              onClick={() => setOpen(false)}
              className="flex h-8 w-8 items-center justify-center border border-foreground/50 text-foreground transition-colors hover:bg-foreground hover:text-background"
            >
              <X className="h-4 w-4" strokeWidth={1.8} />
            </button>
          </div>

          <div className="space-y-3 p-4">
            <p className="text-sm leading-relaxed text-foreground/80">
              Чат поддержки пока находится в разработке.
            </p>
            <p className="label-mono text-muted-foreground">Coming soon</p>
          </div>
        </div>
      )}
    </>
  );
}

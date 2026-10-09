import React from "react";
import ErrorNote from "@/components/shared/ErrorNote";

export default function PreviewBar({ title, note, onBack, backLabel, onPrimary, primaryLabel, busy, failure }) {
  return (
    <div className="sticky top-16 z-30 border-b border-foreground bg-background">
      <div className="container-wtf flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-display text-3xl leading-none">{title}</p>
          {note && <p className="label-mono mt-2 text-muted-foreground">{note}</p>}
          {failure && <ErrorNote>{failure}</ErrorNote>}
        </div>
        <div className="flex items-center gap-6">
          <button type="button" onClick={onBack} className="link-underline">{backLabel}</button>
          {onPrimary && (
            <button type="button" onClick={onPrimary} disabled={busy} className="btn-primary">
              {busy ? "Публикация…" : primaryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
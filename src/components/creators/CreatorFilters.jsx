import React, { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import FilterFields from "@/components/creators/FilterFields";

export default function CreatorFilters({ params, setParam, onReset, activeCount, resultCount }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="hidden md:block">
        <div className="grid grid-cols-[1fr_1fr_1fr_auto] items-end gap-3 border-b border-foreground/20 pb-3">
          <FilterFields params={params} setParam={setParam} idPrefix="d" />

          <div className="flex items-end justify-end pb-1">
            <button
              type="button"
              onClick={onReset}
              disabled={!activeCount}
              className="link-underline disabled:cursor-not-allowed"
            >
              Сбросить
            </button>
          </div>
        </div>
      </div>

      <button type="button" onClick={() => setOpen(true)} className="btn-secondary w-full md:hidden">
        <SlidersHorizontal className="h-4 w-4" /> Фильтры{activeCount > 0 && ` · ${activeCount}`}
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="flex h-[100dvh] flex-col rounded-none border-0 bg-background p-5">
          <SheetHeader className="border-b border-foreground pb-4 text-left">
            <SheetTitle className="font-display text-4xl font-normal">Фильтры</SheetTitle>
          </SheetHeader>
          <div className="grid gap-8 py-8">
            <FilterFields params={params} setParam={setParam} idPrefix="m" />
          </div>
          <div className="mt-auto grid grid-cols-2 gap-3">
            <button type="button" onClick={onReset} className="btn-secondary">Сбросить</button>
            <button type="button" onClick={() => setOpen(false)} className="btn-primary">Показать {resultCount}</button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
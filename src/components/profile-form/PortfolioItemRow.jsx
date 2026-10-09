import React from "react";
import { ArrowDown, ArrowUp, X, FileText, Plus } from "lucide-react";
import { Image } from "@/components/ui/image";
import { pad } from "@/lib/wtf";
import { typeFromUrl } from "@/lib/uploadImage";

const iconBtn = "flex h-9 w-9 items-center justify-center border border-foreground/30 transition-colors hover:border-foreground disabled:opacity-25";

export default function PortfolioItemRow({ item, index, total, onMove, onRemove, onUpdate, onAddImages, onRemoveImage, imageUploading, imageLimit }) {
  const isPdf = (item.type || typeFromUrl(item.url)) === "pdf";
  const images = item.images || [];
  return (
    <li className="grid grid-cols-[84px_1fr] gap-4 border-b border-foreground/20 py-5 sm:grid-cols-[110px_1fr_auto] sm:gap-6">
      <div className="relative aspect-[3/4] overflow-hidden bg-surface">
        {isPdf ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted-foreground">
            <FileText className="h-8 w-8" />
            <span className="label-mono">PDF</span>
          </div>
        ) : (
          <Image src={item.url} alt={item.title || `Работа ${index + 1}`} className="h-full w-full" />
        )}
        {index === 0 && <span className="label-mono absolute inset-x-0 bottom-0 bg-foreground py-1 text-center text-[9px] text-background">Обложка</span>}
      </div>
      <div className="min-w-0 space-y-1">
        <p className="label-mono text-muted-foreground">{pad(index + 1)}</p>
        <input aria-label={`Название работы ${index + 1}`} className="field-input py-2 text-base" placeholder="Название (необязательно)"
          value={item.title || ""} onChange={(e) => onUpdate({ title: e.target.value })} maxLength={80} />
        <input aria-label={`Описание работы ${index + 1}`} className="field-input py-2 text-sm" placeholder="Описание (необязательно)"
          value={item.description || ""} onChange={(e) => onUpdate({ description: e.target.value })} maxLength={200} />
        <textarea aria-label={`История проекта ${index + 1}`} className="field-input min-h-20 resize-y py-2 text-sm" placeholder="История проекта: идея, задача или подход (необязательно)"
          value={item.story || ""} onChange={(e) => onUpdate({ story: e.target.value })} maxLength={800} rows={3} />
        <div className="grid gap-3 pt-1 sm:grid-cols-3">
          <input aria-label={`Клиент проекта ${index + 1}`} className="field-input py-2 text-sm" placeholder="Клиент / проект"
            value={item.client || ""} onChange={(e) => onUpdate({ client: e.target.value })} maxLength={80} />
          <input aria-label={`Роль в проекте ${index + 1}`} className="field-input py-2 text-sm" placeholder="Моя роль"
            value={item.project_role || ""} onChange={(e) => onUpdate({ project_role: e.target.value })} maxLength={60} />
          <input aria-label={`Год проекта ${index + 1}`} className="field-input py-2 text-sm" placeholder="Год"
            value={item.year || ""} onChange={(e) => onUpdate({ year: e.target.value })} maxLength={4} />
        </div>
        <div className="flex flex-wrap items-center gap-2 pt-2">
          {images.map((url, imageIndex) => (
            <div key={url} className="relative h-14 w-12 overflow-hidden bg-surface">
              <Image src={url} alt={`Дополнительный кадр ${imageIndex + 1}`} className="h-full w-full" />
              <button type="button" onClick={() => onRemoveImage(imageIndex)} className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center bg-foreground text-background" aria-label={`Удалить дополнительный кадр ${imageIndex + 1}`}>
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          {images.length < imageLimit && (
            <label className="inline-flex h-9 cursor-pointer items-center gap-2 border border-foreground/30 px-3 text-[10px] uppercase tracking-[0.1em] hover:border-foreground">
              <Plus className="h-3.5 w-3.5" />
              {imageUploading ? "Загрузка…" : "Добавить кадры"}
              <input type="file" multiple accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={imageUploading} onChange={(e) => onAddImages(e.target)} />
            </label>
          )}
        </div>
      </div>
      <div className="col-span-2 flex gap-2 sm:col-span-1 sm:flex-col">
        <button type="button" className={iconBtn} onClick={() => onMove(-1)} disabled={index === 0} aria-label="Переместить выше"><ArrowUp className="h-4 w-4" /></button>
        <button type="button" className={iconBtn} onClick={() => onMove(1)} disabled={index === total - 1} aria-label="Переместить ниже"><ArrowDown className="h-4 w-4" /></button>
        <button type="button" className={iconBtn} onClick={onRemove} aria-label="Удалить работу"><X className="h-4 w-4" /></button>
      </div>
    </li>
  );
}
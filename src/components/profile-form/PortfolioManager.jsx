import React, { useState } from "react";
import { Plus } from "lucide-react";
import PortfolioItemRow from "@/components/profile-form/PortfolioItemRow";
import { checkFile, checkImage, uploadFile, uploadImage, fileType } from "@/lib/uploadImage";
import { PORTFOLIO_MAX, PORTFOLIO_MIN, pad } from "@/lib/wtf";

const PROJECT_IMAGE_MAX = 8;

export default function PortfolioManager({ items, onChange, error }) {
  const [uploading, setUploading] = useState(0);
  const [uploadingImages, setUploadingImages] = useState(null);
  const [uploadError, setUploadError] = useState("");
  const remaining = PORTFOLIO_MAX - items.length;

  const onFiles = async (input) => {
    const all = Array.from(input.files);
    input.value = "";
    const files = all.slice(0, remaining);
    const bad = files.map(checkFile).find(Boolean);
    if (bad) return setUploadError(bad);
    setUploadError(all.length > remaining ? `Максимум ${PORTFOLIO_MAX} работ — лишние файлы пропущены` : "");
    setUploading(files.length);
    try {
      const urls = await Promise.all(files.map(uploadFile));
      const newItems = files.map((f, i) => ({
        url: urls[i],
        type: fileType(f),
        title: fileType(f) === "pdf" ? (f.name || "").replace(/\.pdf$/i, "") : "",
        description: "",
      }));
      onChange([...items, ...newItems]);
    } catch {
      setUploadError("Не удалось загрузить файлы. Проверьте соединение и попробуйте ещё раз.");
    } finally {
      setUploading(0);
    }
  };

  const addProjectImages = async (index, input) => {
    const files = Array.from(input.files || []);
    input.value = "";
    if (!files.length) return;

    const current = items[index].images || [];
    const remainingImages = PROJECT_IMAGE_MAX - current.length;
    const selected = files.slice(0, remainingImages);
    const invalid = selected.map(checkImage).find(Boolean);

    if (invalid) {
      setUploadError(invalid);
      return;
    }

    if (files.length > remainingImages) {
      setUploadError(`В одном проекте можно разместить не более ${PROJECT_IMAGE_MAX} дополнительных кадров`);
    } else {
      setUploadError("");
    }

    if (!selected.length) return;

    setUploadingImages(index);
    try {
      const urls = await Promise.all(selected.map(uploadImage));
      onChange(items.map((item, itemIndex) => itemIndex === index
        ? { ...item, images: [...current, ...urls] }
        : item));
    } catch {
      setUploadError("Не удалось загрузить изображения проекта. Попробуйте ещё раз.");
    } finally {
      setUploadingImages(null);
    }
  };

  const removeProjectImage = (itemIndex, imageIndex) => {
    onChange(items.map((item, index) => index === itemIndex
      ? { ...item, images: (item.images || []).filter((_, currentIndex) => currentIndex !== imageIndex) }
      : item));
  };

  const move = (i, d) => {
    const next = [...items];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };
  const update = (i, patch) => onChange(items.map((it, j) => (j === i ? { ...it, ...patch } : it)));

  return (
    <div>
      <div className="flex items-baseline justify-between border-b border-foreground pb-3">
        <span className="label-mono">Работы</span>
        <span className="label-mono">{pad(items.length)} / {PORTFOLIO_MAX} · минимум {PORTFOLIO_MIN}</span>
      </div>
      {!items.length && !uploading && <p className="py-10 font-display text-3xl italic">Добавьте свои первые работы</p>}
      <ul>
        {items.map((item, i) => (
          <PortfolioItemRow key={item.url + i} item={item} index={i} total={items.length}
            onMove={(d) => move(i, d)} onRemove={() => onChange(items.filter((_, j) => j !== i))} onUpdate={(p) => update(i, p)}
            onAddImages={(input) => addProjectImages(i, input)} onRemoveImage={(imageIndex) => removeProjectImage(i, imageIndex)}
            imageUploading={uploadingImages === i} imageLimit={PROJECT_IMAGE_MAX} />
        ))}
        {Array.from({ length: uploading }).map((_, i) => <li key={`u${i}`} className="skeleton my-5 h-28" aria-label="Загрузка" />)}
      </ul>
      {remaining > 0 && (
        <label className={`mt-6 flex cursor-pointer items-center justify-center gap-3 border border-dashed border-foreground/40 py-10 transition-colors hover:border-foreground hover:bg-surface focus-within:outline focus-within:outline-2 ${uploading ? "pointer-events-none opacity-50" : ""}`}>
          <Plus className="h-4 w-4" />
          <span className="text-[13px] uppercase tracking-[0.08em]">{uploading ? "Загрузка…" : "Добавить изображения или PDF"}</span>
          <input type="file" multiple accept="image/jpeg,image/png,image/webp,application/pdf" className="sr-only" onChange={(e) => onFiles(e.target)} />
        </label>
      )}
      <p className="mt-3 text-sm text-muted-foreground">JPG, PNG, WebP до 10 МБ или PDF до 25 МБ. Первая работа станет обложкой.</p>
      {(uploadError || error) && <p role="alert" className="mt-3 text-sm text-danger">{uploadError || error}</p>}
    </div>
  );
}
import React, { useState } from "react";
import { Image } from "@/components/ui/image";
import { checkImage, uploadImage } from "@/lib/uploadImage";

export default function AvatarField({ value, onChange }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const onFile = async (file) => {
    if (!file) return;
    const bad = checkImage(file);
    if (bad) return setError(bad);
    setError("");
    setBusy(true);
    try { onChange(await uploadImage(file)); }
    catch { setError("Не удалось загрузить изображение. Попробуйте ещё раз."); }
    finally { setBusy(false); }
  };

  return (
    <div className="flex flex-col gap-8 sm:flex-row sm:items-end">
      <div className={`h-48 w-48 shrink-0 overflow-hidden rounded-full bg-surface ${busy ? "animate-pulse" : ""}`}>
        {value && <Image src={value} alt="Ваш аватар" className="h-full w-full" />}
      </div>
      <div className="space-y-4">
        <label className="btn-secondary cursor-pointer focus-within:outline focus-within:outline-2 focus-within:outline-offset-2">
          {busy ? "Загрузка…" : value ? "Заменить фото" : "Загрузить фото"}
          <input type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" disabled={busy} onChange={(e) => onFile(e.target.files[0])} />
        </label>
        {value && <button type="button" onClick={() => onChange("")} className="link-underline block">Удалить</button>}
        <p className="text-sm text-muted-foreground">JPG, PNG или WebP, до 10 МБ</p>
        {error && <p role="alert" className="text-sm text-danger">{error}</p>}
      </div>
    </div>
  );
}
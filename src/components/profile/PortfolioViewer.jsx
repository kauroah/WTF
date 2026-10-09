import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Image } from "@/components/ui/image";
import { pad } from "@/lib/wtf";
import { typeFromUrl } from "@/lib/uploadImage";

const navBtn = "flex h-11 w-11 items-center justify-center border border-background/40 transition-colors hover:bg-background hover:text-foreground";

export default function PortfolioViewer({ items, index, onIndex, onClose }) {
  const item = items[index];
  const isPdf = (item.type || typeFromUrl(item.url)) === "pdf";
  const go = (d) => onIndex((index + d + items.length) % items.length);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  });

  return (
    <div role="dialog" aria-modal="true" aria-label="Просмотр портфолио" className="fixed inset-0 z-50 flex flex-col bg-foreground text-background">
      <div className="label-mono flex h-14 items-center justify-between px-5">
        <span>{pad(index + 1)} / {pad(items.length)}</span>
        <button type="button" autoFocus onClick={onClose} className="flex items-center gap-2">Закрыть <X className="h-4 w-4" /></button>
      </div>
      <motion.div
        key={index}
        className="min-h-0 flex-1 cursor-grab px-3 active:cursor-grabbing md:px-16"
        drag={isPdf ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.4}
        onDragEnd={(_, info) => { if (!isPdf) { if (info.offset.x < -60) go(1); if (info.offset.x > 60) go(-1); } }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {isPdf ? (
          <iframe title={item.title || "PDF"} src={item.url} className="h-full w-full bg-white" />
        ) : (
          <Image src={item.url} alt={item.title || `Работа ${index + 1}`} fittingType="fit" className="pointer-events-none h-full w-full select-none object-contain" />
        )}
      </motion.div>
      <div className="flex items-end justify-between gap-6 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-5">
        <div className="min-w-0">
          {item.title && <p className="font-display text-2xl">{item.title}</p>}
          {item.description && <p className="text-sm opacity-70">{item.description}</p>}
          {isPdf && (
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="link-underline mt-2 inline-block">Открыть PDF в новой вкладке</a>
          )}
        </div>
        <div className="flex shrink-0 gap-2">
          <button type="button" aria-label="Предыдущая работа" onClick={() => go(-1)} className={navBtn}><ArrowLeft className="h-4 w-4" /></button>
          <button type="button" aria-label="Следующая работа" onClick={() => go(1)} className={navBtn}><ArrowRight className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  );
}
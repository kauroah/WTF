import React from "react";
import { Link } from "@/lib/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useShortlist } from "@/hooks/useShortlist";

export default function ShortlistBar() {
  const { ids } = useShortlist();
  const n = ids.length;
  return (
    <AnimatePresence>
      {n > 0 && (
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 24, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-30 md:inset-x-auto md:bottom-8 md:right-8"
        >
          <Link
            to="/selected"
            aria-label={`Выбрано специалистов: ${n}. Посмотреть`}
            className="flex items-center justify-between gap-10 bg-foreground px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] text-background transition-colors hover:bg-accent md:py-4"
          >
            <span className="label-mono md:hidden">{n} выбрано · Посмотреть</span>
            <span className="hidden items-baseline gap-3 md:flex">
              <span className="label-mono opacity-70">Выбрано:</span>
              <span className="font-display text-3xl leading-none">{n}</span>
            </span>
            <span className="flex items-center gap-2 text-[13px] uppercase tracking-[0.08em]">
              <span className="hidden md:inline">Посмотреть</span>
              <ArrowRight className="h-4 w-4" />
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
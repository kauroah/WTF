import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { plural } from "@/lib/wtf";

export default function SentState({ count }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="container-wtf py-20 md:py-32">
      <p className="label-mono text-muted-foreground">Готово</p>
      <h1 className="mt-4 max-w-4xl font-display text-6xl leading-[0.92] md:text-8xl">Предложения отправлены</h1>
      <p className="mt-8 max-w-lg text-lg">
        {count} {plural(count, ["специалист", "специалиста", "специалистов"])} {count === 1 ? "получит" : "получат"} ваше предложение. Ответы появятся в разделе «Предложения».
      </p>
      <div className="mt-12 flex flex-wrap items-center gap-4">
        <Link to="/creators" className="btn-primary">Продолжить поиск</Link>
        <Link to="/profile" className="btn-secondary">Мой профиль</Link>
        <Link to="/profile/requests?tab=sent" className="link-underline ml-2">Отправленные</Link>
      </div>
    </motion.div>
  );
}
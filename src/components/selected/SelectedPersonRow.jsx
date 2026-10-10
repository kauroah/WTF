import React from "react";
import { Link } from "@/lib/navigation";
import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { coverOf, pad, roleNames } from "@/lib/wtf";

export default function SelectedPersonRow({ person, index, onRemove }) {
  const actions = (
    <>
      <Link to={`/creators/${person.username}`} state={{ from: "/selected" }} className="link-underline">Открыть профиль</Link>
      <button type="button" onClick={onRemove} className="link-underline text-muted-foreground">Удалить</button>
    </>
  );
  return (
    <motion.li layout exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}
      className="grid grid-cols-[96px_1fr] items-center gap-5 border-b border-foreground/20 py-6 md:grid-cols-[56px_120px_1fr_auto] md:gap-8">
      <span className="hidden font-display text-4xl md:block">{pad(index + 1)}</span>
      <div className="aspect-[3/4] overflow-hidden bg-surface">
        <Image src={coverOf(person)} alt={person.full_name} className="h-full w-full" />
      </div>
      <div className="min-w-0">
        <p className="label-mono text-muted-foreground">{roleNames(person).join(" / ")}</p>
        <h3 className="mt-2 font-display text-3xl leading-none md:text-4xl">{person.full_name}</h3>
        <p className="mt-2 text-sm">{person.city}</p>
        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 md:hidden">{actions}</div>
      </div>
      <div className="hidden gap-8 md:flex">{actions}</div>
    </motion.li>
  );
}
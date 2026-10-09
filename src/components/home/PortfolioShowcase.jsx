import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { usePublishedCreators } from "@/pages/Creators";
import { Image } from "@/components/ui/image";
import { coverOf, roleNames, pad } from "@/lib/wtf";

export default function PortfolioShowcase() {
  const { data = [] } = usePublishedCreators();
  const profiles = data.filter((p) => coverOf(p)).slice(0, 10);
  const loop = [...profiles, ...profiles];

  return (
    <section className="overflow-hidden py-12 md:py-20" aria-labelledby="folio-title">
      <div className="container-wtf mb-10 flex items-baseline gap-6 border-b border-border pb-4">
        <span className="label-mono">03</span>
        <h2 id="folio-title" className="label-mono">Портфолио</h2>
      </div>

      {profiles.length === 0 ? (
        <p className="container-wtf text-muted-foreground">Скоро здесь появятся работы.</p>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="group relative [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]"
        >
          <div className="flex w-max will-change-transform [animation:mb-marquee_50s_linear_infinite] group-hover:[animation-play-state:paused]">
            {loop.map((p, i) => (
              <Link
                key={i}
                to={`/creators/${p.username}`}
                className="group/card relative block w-[260px] shrink-0 pr-4 sm:w-[300px] md:w-[340px] md:pr-6"
              >
                <div className="aspect-[3/4] overflow-hidden bg-surface">
                  <Image
                    src={coverOf(p)}
                    alt=""
                    className="h-full w-full transition-transform duration-[900ms] ease-out group-hover/card:scale-[1.05]"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent p-4 pt-14">
                  <p className="font-display text-2xl leading-tight text-cream">{p.full_name}</p>
                  <p className="label-mono mt-1 text-cream/70">{roleNames(p).join(" / ")}</p>
                </div>
                <span className="label-mono absolute left-3 top-3 text-cream/80">{pad((i % profiles.length) + 1)}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}

      <div className="container-wtf mt-10">
        <Link to="/creators" className="link-underline">Все специалисты →</Link>
      </div>
    </section>
  );
}
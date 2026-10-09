import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import { Image } from "@/components/ui/image";
import SectionHead from "@/components/shared/SectionHead";
import EmptyState from "@/components/shared/EmptyState";
import PortfolioViewer from "@/components/profile/PortfolioViewer";
import { pad, plural } from "@/lib/wtf";
import { typeFromUrl } from "@/lib/uploadImage";

const LAYOUT = [
  "col-span-2 md:col-span-7 aspect-[4/5]",
  "col-span-1 md:col-span-5 md:mt-40 aspect-[3/4]",
  "col-span-1 md:col-span-4 aspect-[3/4]",
  "col-span-2 md:col-span-8 aspect-[3/2]",
  "col-span-2 md:col-span-6 md:col-start-4 aspect-[4/5]",
];

export default function PortfolioGallery({ items = [], username, linkToProjects = false }) {
  const [open, setOpen] = useState(null);
  const n = items.length;
  return (
    <section className="container-wtf py-16 md:py-24" aria-labelledby="portfolio-title">
      <SectionHead id="portfolio-title" num="01" title="Портфолио" aside={<span className="label-mono">{pad(n)} {plural(n, ["работа", "работы", "работ"])}</span>} />
      {!n ? <EmptyState title="Добавьте свои первые работы" /> : (
        <div className={n === 1 ? "grid gap-6 md:grid-cols-12 md:gap-8" : "grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-12 md:gap-x-8 md:gap-y-16"}>
          {items.map((item, i) => {
            const isPdf = (item.type || typeFromUrl(item.url)) === "pdf";
            const aspect = LAYOUT[i % LAYOUT.length].match(/aspect-\S+/)[0];
            const singleWork = n === 1;
            const projectPath = `/creators/${username}/portfolio/${i + 1}`;
            const media = isPdf ? (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-muted-foreground">
                <FileText className="h-10 w-10" />
                <span className="label-mono">PDF</span>
              </div>
            ) : (
              <Image src={item.url} alt={item.title || `Работа ${i + 1}`} className="h-full w-full transition-transform duration-[900ms] group-hover:scale-[1.02]" />
            );
            return (
              <React.Fragment key={item.url + i}>
                <figure className={singleWork ? "md:col-span-8" : LAYOUT[i % LAYOUT.length].replace(/aspect-\S+/, "")}>
                  {linkToProjects ? (
                    <Link to={projectPath} className={`group block w-full overflow-hidden bg-surface ${singleWork ? "aspect-[4/5] md:aspect-[5/4]" : aspect}`} aria-label={`Открыть проект ${i + 1}${item.title ? `: ${item.title}` : ""}`}>
                      {media}
                    </Link>
                  ) : (
                    <button type="button" onClick={() => setOpen(i)} className={`group block w-full overflow-hidden bg-surface ${singleWork ? "aspect-[4/5] md:aspect-[5/4]" : aspect}`} aria-label={`Открыть работу ${i + 1}${item.title ? `: ${item.title}` : ""}`}>
                      {media}
                    </button>
                  )}
                  {!singleWork && (
                    <figcaption className="mt-3 flex gap-3">
                      <span className="label-mono pt-1 text-muted-foreground">{pad(i + 1)}</span>
                      <span>
                        {item.title && (
                          linkToProjects ? (
                            <Link to={projectPath} className="block font-display text-xl leading-tight hover:underline">{item.title}</Link>
                          ) : (
                            <span className="block font-display text-xl leading-tight">{item.title}</span>
                          )
                        )}
                        {item.description && <span className="mt-1 block text-sm text-muted-foreground">{item.description}</span>}
                        {(item.demo_sample || item.demo_gallery) && <span className="label-mono mt-2 block text-muted-foreground">Демо-проект</span>}
                      </span>
                    </figcaption>
                  )}
                </figure>
                {singleWork && (
                  <div className="flex flex-col justify-center border-t border-foreground/20 pt-5 md:col-span-4 md:border-l md:border-t-0 md:pl-8 md:pt-0">
                    <p className="label-mono text-muted-foreground">Избранная работа · {pad(i + 1)} / {pad(n)}</p>
                    {item.title && <h3 className="mt-5 font-display text-4xl leading-[0.95] md:text-5xl">{item.title}</h3>}
                    {item.description && <p className="mt-4 max-w-sm text-base leading-relaxed text-muted-foreground">{item.description}</p>}
                    {linkToProjects ? (
                      <Link to={projectPath} className="link-underline mt-8 w-fit">Подробнее о проекте</Link>
                    ) : (
                      <button type="button" onClick={() => setOpen(i)} className="link-underline mt-8 w-fit">Открыть работу</button>
                    )}
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
      {!linkToProjects && open !== null && <PortfolioViewer items={items} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </section>
  );
}
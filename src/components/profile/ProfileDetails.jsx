import React from "react";
import SectionHead from "@/components/shared/SectionHead";
import { EXPERIENCE, contactLinks, nameOf, roleNames, specNames } from "@/lib/wtf";

export default function ProfileDetails({ profile }) {
  const contacts = contactLinks(profile);
  const rows = [
    ["Роли", roleNames(profile).join(", ")],
    ["Направления", specNames(profile).join(", ")],
    ["Опыт", profile.experience_level ? nameOf(EXPERIENCE, profile.experience_level) : "—"],
    ["Город", profile.city],
  ];
  return (
    <section className="container-wtf pb-24" aria-labelledby="details-title">
      <SectionHead id="details-title" num="02" title="О специалисте" />
      <div className="grid gap-12 md:grid-cols-12">
        <dl className="md:col-span-7">
          {rows.map(([k, v]) => (
            <div key={k} className="grid grid-cols-[100px_1fr] gap-4 border-b border-foreground/20 py-4 md:grid-cols-[160px_1fr]">
              <dt className="label-mono pt-1 text-muted-foreground">{k}</dt>
              <dd className="font-display text-xl leading-snug md:text-2xl">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="md:col-span-4 md:col-start-9">
          <p className="label-mono text-muted-foreground">Связаться напрямую</p>
          {contacts.length ? (
            <ul className="mt-5">
              {contacts.map((c) => (
                <li key={c.label}>
                  <a href={c.href} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between gap-4 border-b border-foreground/20 py-4 first:border-t">
                    <span className="label-mono text-muted-foreground">{c.label}</span>
                    <span className="truncate font-display text-xl group-hover:italic md:text-2xl">{c.value}</span>
                  </a>
                </li>
              ))}
            </ul>
          ) : <p className="mt-5 border-t border-foreground/20 pt-4 text-muted-foreground">Специалист пока не добавил контакты.</p>}
        </div>
      </div>
    </section>
  );
}
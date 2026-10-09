import React from "react";

export default function SectionHead({ num, title, aside, id }) {
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-4 border-b border-border pb-4 md:mb-14">
      <div className="flex items-baseline gap-4 md:gap-6">
        <span className="label-mono">{num}</span>
        <h2 id={id} className="font-display text-4xl leading-none md:text-6xl">{title}</h2>
      </div>
      {aside}
    </div>
  );
}
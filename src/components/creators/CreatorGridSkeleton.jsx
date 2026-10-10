import React from "react";

export default function CreatorGridSkeleton({ count = 8 }) {
  return (
    <div className="columns-1 gap-8 sm:columns-2 md:columns-3 md:gap-12" aria-busy="true" aria-label="Загрузка специалистов">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="mb-8 inline-block w-full break-inside-avoid md:mb-12">
          <div className={`skeleton ${i % 3 === 1 ? "aspect-[4/3]" : i % 3 === 2 ? "aspect-[3/5]" : "aspect-[3/4]"}`} />
          <div className="skeleton mt-3 h-6 w-3/4" />
          <div className="skeleton mt-2 h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}
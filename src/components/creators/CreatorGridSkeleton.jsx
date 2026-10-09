import React from "react";

export default function CreatorGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-12 md:grid-cols-3 md:gap-x-6 lg:grid-cols-4" aria-busy="true" aria-label="Загрузка специалистов">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="skeleton aspect-[3/4]" />
          <div className="skeleton mt-4 h-6 w-3/4" />
          <div className="skeleton mt-2 h-3 w-1/2" />
        </div>
      ))}
    </div>
  );
}
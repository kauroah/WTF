import React from "react";

export default function PageSkeleton() {
  return (
    <div className="container-wtf grid gap-10 py-14 md:grid-cols-12" aria-busy="true" aria-label="Загрузка">
      <div className="space-y-4 md:col-span-5">
        <div className="skeleton h-3 w-32" />
        <div className="skeleton h-16 w-4/5" />
        <div className="skeleton h-4 w-3/5" />
      </div>
      <div className="skeleton aspect-[4/5] md:col-span-6 md:col-start-7" />
    </div>
  );
}
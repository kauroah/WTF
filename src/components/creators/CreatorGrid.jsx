import React from "react";
import CreatorCard from "@/components/creators/CreatorCard";

export default function CreatorGrid({ profiles }) {
  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-5 md:gap-y-12 lg:grid-cols-4 lg:gap-x-6 lg:[&>*:nth-child(4n+2)]:mt-12 lg:[&>*:nth-child(4n+4)]:mt-8">
      {profiles.map((p, i) => (
        <CreatorCard key={p.id} profile={p} index={i} />
      ))}
    </div>
  );
}
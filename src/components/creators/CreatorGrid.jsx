import React from "react";
import SpecialistPortfolioCard from "@/components/creators/SpecialistPortfolioCard";

export default function CreatorGrid({ profiles }) {
  return (
    <div className="columns-1 gap-8 sm:columns-2 md:gap-12 md:columns-3">
      {profiles.map((profile) => (
        <SpecialistPortfolioCard key={profile.id} profile={profile} />
      ))}
    </div>
  );
}
import React from "react";
import { Link } from "@/lib/navigation";
import { usePublishedCreators } from "@/pages/Creators";
import SectionHead from "@/components/shared/SectionHead";
import CreatorGrid from "@/components/creators/CreatorGrid";
import CreatorGridSkeleton from "@/components/creators/CreatorGridSkeleton";

export default function DiscoveryPreview() {
  const { data = [], isLoading } = usePublishedCreators();
  return (
    <section className="container-wtf py-12 md:py-20" aria-labelledby="discover-title">
      <SectionHead id="discover-title" num="01" title="Сейчас в каталоге"
        aside={<Link to="/creators" className="link-underline">Все специалисты →</Link>} />
      {isLoading ? <CreatorGridSkeleton count={4} /> : <CreatorGrid profiles={data.slice(0, 4)} />}
    </section>
  );
}
import React from "react";
import ProfileHero from "@/components/profile/ProfileHero";
import PortfolioGallery from "@/components/profile/PortfolioGallery";
import ProfileDetails from "@/components/profile/ProfileDetails";

export default function ProfileView({ profile, actions, mode = "public" }) {
  return (
    <article>
      <ProfileHero profile={profile} actions={actions} mode={mode} />
      <PortfolioGallery
        items={profile.portfolio || []}
        username={profile.username}
        linkToProjects={mode === "public" && profile.status === "published"}
      />
      <ProfileDetails profile={profile} />
    </article>
  );
}
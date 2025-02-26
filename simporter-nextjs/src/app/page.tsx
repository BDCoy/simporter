"use client";
import React from "react";
import { useSidebar } from "@/context/SidebarContext";

// Landing page components
import TrustedByBanner from "@/components/landingPage/TrustedByBanner";
import WelcomePage from "@/components/ui/WelcomePage";
import TheLibrary from "@/components/ui/TheLibrary";
import LandingBlock1 from "@/components/landingPage/LandingBlock1";
import LandingBlock2 from "@/components/landingPage/LandingBlock2";
import PricingCards from "@/components/landingPage/PricingCards";
import CTABanner from "@/components/landingPage/CTABanner";
import SiteFooter from "@/components/landingPage/SiteFooter";

// Maple-1 components
import FullSearch from "@/components/maple-1/FullSearch";

export default function HomePage() {
  const { isExpanded } = useSidebar();

  return (
    <div className={`flex-1 ${isExpanded ? "md:ml-64" : "md:ml-16"} space-y-8 p-4 transition-all duration-300`}>
      {/* Content components remain the same */}
      <FullSearch />
      <TrustedByBanner />
      <WelcomePage />
      <TheLibrary />
      <LandingBlock1 title="Benefits" imageUrl="/images/landing1.jpg" imageAlt="Simporter Landing Block 1" />
      <LandingBlock2
        title="Features"
        subtitle="Innovative Solutions"
        description="Empowering your business with AI-driven insights."
        imageUrl="/images/landing2.jpg"
        imageAlt="Simporter Landing Block 2"
      />
      <PricingCards />
      <CTABanner />
      <SiteFooter />
    </div>
  );
}
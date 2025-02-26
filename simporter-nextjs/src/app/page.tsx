"use client";

import React from "react";

// Landing page components
import TrustedByBanner from "@/components/landingPage/TrustedByBanner";
import WelcomePage from "@/components/ui/WelcomePage";
import TheLibrary from "@/components/ui/TheLibrary";
import LandingBlock1 from "@/components/landingPage/LandingBlock1";
import LandingBlock2 from "@/components/landingPage/LandingBlock2";
import PricingCards from "@/components/landingPage/PricingCards";
import CTABanner from "@/components/landingPage/CTABanner";
import SiteFooter from "@/components/landingPage/SiteFooter";
import Sidebar from "@/components/layout/Sidebar";

// Maple-1 components
import FullSearch from "@/components/maple-1/FullSearch";

export default function HomePage() {
  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar - pinned/fixed for main page only */}
      <div className="hidden md:block fixed left-0 top-0 w-64 h-screen bg-white border-r border-gray-200 shadow-md z-50">
        <Sidebar />
      </div>

      {/* Main Content (offset by 64px on md+ screens) */}
      <div className="flex-1 md:ml-64 space-y-8 p-4">
        {/* 1. Full Search Component */}
        <FullSearch />

        {/* 2. TrustedByBanner */}
        <TrustedByBanner />

        {/* 3. Welcome */}
        <WelcomePage />

        {/* 4. TheLibrary */}
        <TheLibrary />

        {/* 5. LandingBlock1 */}
        <LandingBlock1
          title="Benefits"
          imageUrl="/images/landing1.jpg"
          imageAlt="Simporter Landing Block 1"
        />

        {/* 6. LandingBlock2 */}
        <LandingBlock2
          title="Features"
          subtitle="Innovative Solutions"
          description="Empowering your business with AI-driven insights."
          imageUrl="/images/landing2.jpg"
          imageAlt="Simporter Landing Block 2"
        />

        {/* 7. Pricing */}
        <PricingCards />

        {/* 8. CTA Banner */}
        <CTABanner />

        {/* 9. Footer */}
        <SiteFooter />
      </div>
    </div>
  );
}

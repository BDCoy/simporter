"use client"
import { useState } from "react"

// Landing page components
import TrustedByBanner from "@/components/landingPage/TrustedByBanner"
import WelcomePage from "@/components/ui/WelcomePage"
import TheLibrary from "@/components/ui/TheLibrary"
import LandingBlock1 from "@/components/landingPage/LandingBlock1"
import LandingBlock2 from "@/components/landingPage/LandingBlock2"
import PricingCards from "@/components/landingPage/PricingCards"
import CTABanner from "@/components/landingPage/CTABanner"
import SiteFooter from "@/components/landingPage/SiteFooter"
import Sidebar from "@/components/layout/Sidebar"

// Maple-1 components
import FullSearch from "@/components/maple-1/FullSearch"

export default function HomePage() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar - pinned/fixed for main page only */}
      <div className="hidden md:block fixed left-0 top-0 h-screen bg-white border-r border-gray-200 shadow-md z-50">
        <Sidebar onExpandedChange={(expanded) => setIsExpanded(expanded)} />
      </div>

      {/* Main Content - dynamically adjust margin based on sidebar state */}
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
    </div>
  )
}


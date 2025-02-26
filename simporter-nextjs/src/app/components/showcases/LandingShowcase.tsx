import React from 'react';
import LandingBlock1 from '@/components/landingPage/LandingBlock1';
import LandingBlock2 from '@/components/landingPage/LandingBlock2';

export default function LandingShowcase() {
  return (
    <div className="w-full">
      {/* LandingBlock1 examples */}
      <LandingBlock1 
        title="Get answers in minutes, not months. Skip the long research."
        imageUrl="https://plus.unsplash.com/premium_photo-1674327130512-e43cf6fc1c66?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        imageAlt="Simporter insights dashboard"
      />
      
      <LandingBlock1 
        title="Get the latest data about your market. Not just general AI guesses."
        imageUrl="https://plus.unsplash.com/premium_photo-1674327129931-7485affddfcb?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        imageAlt="Market data visualization"
      />
      
      <LandingBlock1 
        title="Make reports and slides with one click. No more late nights making decks."
        imageUrl="https://plus.unsplash.com/premium_photo-1675369697207-705d6e31e732?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        imageAlt="One-click report generation"
      />
      
      <LandingBlock1 
        title="Share market research with your team. Keep everyone up to date."
        imageUrl="https://plus.unsplash.com/premium_photo-1674707665450-48459021ffed?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        imageAlt="Team sharing interface"
      />

      {/* LandingBlock2 examples */}
      <LandingBlock2 
        title="Key Features"
        subtitle="Ask better questions. Get better answers."
        description="Get the latest market data to find answers you can trust. Just pick your topic and our AI guides you to the right questions - like having a research expert by your side. While other tools offer old data, you can access real-time insights to show you what matters right now."
        imageUrl="https://plus.unsplash.com/premium_photo-1674327130512-e43cf6fc1c66?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        imageAlt="AI guided question interface"
      />
      
      <LandingBlock2 
        title="Feature Details"
        subtitle="Make great-looking reports fast. Share what matters."
        description="Turn your findings into clean slides and reports with one click. Each report looks professional and is ready to share. Stop spending hours making things look nice."
        imageUrl="https://plus.unsplash.com/premium_photo-1674327129931-7485affddfcb?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        imageAlt="Report generation"
        reverse={true}
      />
      
      <LandingBlock2 
        title="Industry Solutions"
        subtitle="Learn about any industry quickly. Get specific insights."
        description="Whether you work in food, banking, movies, or cars, get answers that matter to your business. No more sorting through general info to find what you need."
        imageUrl="https://plus.unsplash.com/premium_photo-1675369697207-705d6e31e732?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        imageAlt="Industry specific insights"
      />
      
      <LandingBlock2 
        title="Team Collaboration"
        subtitle="Work with your team easily. Keep everything in one place."
        description="Share your research with everyone who needs it. Your team can see all the insights, add their own findings, and find what they need fast."
        imageUrl="https://plus.unsplash.com/premium_photo-1674707665450-48459021ffed?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        imageAlt="Team collaboration interface"
        reverse={true}
      />
      
      <LandingBlock2 
        title="Trend Analysis"
        subtitle="Spot new trends first. Know what's changing."
        description="See how customers are changing their minds, what they think about brands, and what's new in your market. Find opportunities before others do."
        imageUrl="https://plus.unsplash.com/premium_photo-1674327130512-e43cf6fc1c66?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        imageAlt="Trend analysis dashboard"
      />
    </div>
  );
}
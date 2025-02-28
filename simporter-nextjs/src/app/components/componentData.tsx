"use client";

import React from "react";

// Showcases
import ButtonShowcase from "./showcases/ButtonShowcase";
import CardShowcase from "./showcases/CardShowcase";
import DropdownShowcase from "./showcases/DropdownShowcase";
import SearchShowcase from "./showcases/SearchShowcase";

// Landing Page Blocks
import LandingBlock1 from "../../components/landingPage/LandingBlock1";
import LandingBlock2 from "../../components/landingPage/LandingBlock2";

// UI Components
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";
import ChatwithFileUpload from "../../components/chat/ChatElements/ChatwithFileUpload";
import ComponentDisplay from "../../components/ui/ComponentDisplay";
import ComponentsDropdown from "../../components/ui/ComponentsDropdown";
import Dropdown from "../../components/ui/Dropdown";
import EnhancedSearchbar from "../../components/ui/EnhancedSearchbar";
import Header from "../../components/ui/Header";
import IDELayout from "../../components/chat/IDELayout";
import MainContent from "../../components/ui/MainContent";
import PricingCards from "../../components/landingPage/PricingCards";
import SSOLogin from "../../components/auth/SSOLogin";
import CompactSSOLogin from "../../components/auth/CompactSSOLogin";
import CTABanner from "../../components/landingPage/CTABanner";
import SiteFooter from "../../components/landingPage/SiteFooter";
import ProjectCard from "../../components/ui/ProjectCard";
import SearchBarWithCommands from "../../components/maple-1/SearchBarWithCommands";
import SearchInput from "../../components/ui/SearchInput";
import Slides from "../../components/chat/Tabs/Slides";
import TaskList from "../../components/chat/Tabs/TaskList";
import ViewActions from "../../components/chat/ViewActions";
import ViewTabs from "../../components/chat/Tabs/ViewTabs";
import VisualInspector from "../../components/chat/ChatElements/VisualInspector";
import WelcomePage from "../../components/ui/WelcomePage";
import InspiringCarousel from "@/components/ui/InspiringCarousel";
import TrustedByBanner from "@/components/landingPage/TrustedByBanner";
import ProjectGrid from "@/components/ui/ProjectGrid";

// Chat Components
import ChatMessageWithTasks from "../../components/chat/ChatElements/ChatMessageWithTasks";
import CollapsibleTaskList from "../../components/chat/ChatElements/CollapsibleTaskList";
import EnhancedChat from "../../components/chat/ChatElements/EnhancedChat";
import ExecutionPanel from "../../components/chat/Tabs/ExecutionPanel";

// CreateSlideModal (if needed)
import CreateSlideModal from "../../components/chat/Tabs/CreateSlideModal";

export interface ShowcaseItem {
  type: string;
  name: string;
  component: React.ReactNode;
}

const sampleProject = {
  id: "sample-project",
  name: "Sample Project",
  created_at: new Date().toISOString(),
  status: "active",
  category: "Demo",
};

// Define sampleProjects as an array to use in the ProjectGrid
const sampleProjects = [sampleProject];

export const showcaseItems: ShowcaseItem[] = [
  // --- Pages
  { type: "Page", name: "Welcome Page", component: <WelcomePage /> },

  // --- Showcases
  { type: "Showcase", name: "Button Showcase", component: <ButtonShowcase /> },
  { type: "Showcase", name: "Card Showcase", component: <CardShowcase /> },
  { type: "Showcase", name: "Dropdown Showcase", component: <DropdownShowcase /> },
  { type: "Showcase", name: "Search Showcase", component: <SearchShowcase /> },

  // --- Landing Components
  { type: "Landing", name: "Pricing Cards", component: <PricingCards /> },
  { type: "Landing", name: "CTA Banner", component: <CTABanner /> },
  { type: "Landing", name: "Site Footer", component: <SiteFooter /> },
  {
    type: "Landing",
    name: "Landing Block 1",
    component: (
      <LandingBlock1 
        title="Welcome to Simporter" 
        imageUrl="/images/landing1.jpg" 
        imageAlt="Simporter Landing Block 1" 
      />
    ),
  },
  {
    type: "Landing",
    name: "Landing Block 2",
    component: (
      <LandingBlock2 
        title="Discover the Future" 
        subtitle="Innovative Solutions" 
        description="Empowering your business with AI-driven insights." 
        imageUrl="/images/landing2.jpg" 
        imageAlt="Simporter Landing Block 2" 
      />
    ),
  },

  // --- Authentication Components
  {
    type: "Auth",
    name: "SSO Login",
    component: <SSOLogin />,
  },
  {
    type: "Auth",
    name: "Compact SSO Login",
    component: <CompactSSOLogin />,
  },
  {
    type: "Auth",
    name: "Auto Login",
    component: <CompactSSOLogin showAutoLogin={true} userEmail="user@simporter.com" />,
  },

  // --- Individual UI Components
  { type: "UI", name: "Button", component: <Button>Click Me</Button> },
  { type: "UI", name: "Card", component: <Card content="Sample Card Content" /> },
  {
    type: "UI",
    name: "Chat with File Upload",
    component: <ChatwithFileUpload onSendMessage={() => {}} />,
  },
  { type: "UI", name: "Component Display", component: <ComponentDisplay /> },
  { type: "UI", name: "Components Dropdown", component: <ComponentsDropdown components={[]} /> },
  {
    type: "UI",
    name: "Dropdown",
    component: (
      <Dropdown
        options={[
          { value: "Option1", label: "Option 1" },
          { value: "Option2", label: "Option 2" },
        ]}
        value="Option1"
        onChange={() => {}}
      />
    ),
  },
  {
    type: "UI",
    name: "Enhanced Searchbar",
    component: (
      <EnhancedSearchbar
        onSearch={(query: string, useAiDiscovery: boolean) => {
          throw new Error("Function not implemented.");
        }}
        onEnhancePrompt={(query: string) => {
          throw new Error("Function not implemented.");
        }}
      />
    ),
  },
  { type: "UI", name: "Header", component: <Header /> },
  { type: "UI", name: "IDE Layout", component: <IDELayout /> },
  { type: "UI", name: "Main Content", component: <MainContent /> },
  {
    type: "UI",
    name: "Project Card",
    component: (
      <ProjectCard
        project={{ ...sampleProject, description: "This is a sample project description." }}
        onOpen={() => {}}
        onArchive={() => {}}
      />
    ),
  },
  {
    type: "UI",
    name: "Search Bar with Commands",
    component: (
      <SearchBarWithCommands
        onSearch={(q: string) => console.log("Search query:", q)}
        onEnhancePrompt={() => console.log("Enhance prompt clicked")}
      />
    ),
  },
  {
    type: "UI",
    name: "Search Input",
    component: <SearchInput onSearch={(q) => console.log("Search input:", q)} />,
  },
  {
    type: "UI",
    name: "Slides",
    component: (
      <Slides
        isOpen={false}
        onClose={() => {}}
        onCreateSlide={(content: string) => {}}
      />
    ),
  },
  {
    type: "UI",
    name: "Task List",
    component: <TaskList tasks={[]} />,
  },
  {
    type: "UI",
    name: "View Actions",
    component: <ViewActions activeTab="default" />,
  },
  {
    type: "UI",
    name: "View Tabs",
    component: <ViewTabs activeTab="default" setActiveTab={() => {}} />,
  },
  {
    type: "UI",
    name: "Visual Inspector",
    component: <VisualInspector isActive={false} onSelectElement={() => {}} />,
  },
  {
    type: "UI",
    name: "Create Slide Modal",
    component: (
      <CreateSlideModal
        isOpen={false}
        onClose={() => {}}
        onCreateSlide={() => {}}
      />
    ),
  },
  {
    type: "UI",
    name: "Inspiring Carousel",
    component: <InspiringCarousel prompts={[
      "Analyze emerging trends in {beauty} for Gen Z consumers",
      "Map sustainable innovations in {personal care} packaging",
      "Track consumer sentiment around {clean beauty}",
    ]} />,
  },
  {
    type: "UI",
    name: "Trusted By Banner",
    component: <TrustedByBanner />,
  },
  {
    type: "UI",
    name: "Project Grid",
    component: (
      <ProjectGrid 
        projects={sampleProjects} 
        onOpen={(id) => console.log("Open project", id)} 
        onArchive={(id) => console.log("Archive project", id)} 
      />
    ),
  },

  // --- Chat Components
  {
    type: "Chat",
    name: "Chat Message with Tasks",
    component: <ChatMessageWithTasks message="Hello" timestamp={new Date()} />,
  },
  {
    type: "Chat",
    name: "Collapsible Task List",
    component: (
      <CollapsibleTaskList
        title="Tasks for Today"
        message="Here are your tasks"
        tasks={[]}
      />
    ),
  },
  { type: "Chat", name: "Enhanced Chat", component: <EnhancedChat /> },
  {
    type: "Chat",
    name: "Execution Panel",
    component: <ExecutionPanel initialMessage="Sample initial message" />,
  },
];

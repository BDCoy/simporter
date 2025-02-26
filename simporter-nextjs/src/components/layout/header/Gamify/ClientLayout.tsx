"use client";

import React, { useState } from "react";
import { AchievementNotification } from "./AchievementNotification";
import GlassmorphismHeader from "./GlassmorphismHeader"; // Ensure you have this component

export default function ClientLayout() {
  const [showAchievement, setShowAchievement] = useState(true);

  return (
    <>
      <GlassmorphismHeader />
      {showAchievement && (
        <AchievementNotification
          title="Welcome to Simporter!"
          icon="🎉"
          onClose={() => setShowAchievement(false)}
          isNew={true}
        />
      )}
    </>
  );
}

"use client";
import React, { useState } from "react";
import VisualInspector from "../../components/ui/VisualInspector";

export default function InspectorDemo() {
  const [active, setActive] = useState(false);

  return (
    <div style={{ padding: "2rem" }}>
      <button
        onClick={() => setActive(!active)}
        className="px-4 py-2 bg-blue-500 text-white rounded mb-4"
      >
        Toggle Inspector
      </button>

      <p>Click the button above to toggle the visual inspector.</p>

      <VisualInspector
        isActive={active}
        onSelectElement={(element) => {
          alert(`Selected element: ${element.tagName}.${element.className}`);
        }}
      />
    </div>
  );
}

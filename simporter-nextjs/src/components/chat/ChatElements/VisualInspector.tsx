"use client"

import React, { useState, useEffect, useRef } from 'react';

interface InspectableElement {
  id: string;
  tagName: string;
  className: string;
  rect: DOMRect;
}

interface VisualInspectorProps {
  isActive: boolean;
  onSelectElement: (element: InspectableElement) => void;
}

const VisualInspector: React.FC<VisualInspectorProps> = ({
  isActive,
  onSelectElement,
}) => {
  const [hoveredElement, setHoveredElement] = useState<InspectableElement | null>(null);
  const [overlayPosition, setOverlayPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!isActive) {
      setHoveredElement(null);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isActive) return;
      
      // Get the element under the mouse
      const element = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement;
      if (!element) return;
      
      // Skip inspector overlay elements
      if (element === overlayRef.current || overlayRef.current?.contains(element)) {
        return;
      }
      
      // Skip non-visible elements
      const computedStyle = window.getComputedStyle(element);
      if (computedStyle.display === 'none' || computedStyle.visibility === 'hidden') {
        return;
      }
      
      const rect = element.getBoundingClientRect();
      
      // Create element data
      const elementData: InspectableElement = {
        id: element.id || `element-${Math.random().toString(36).substr(2, 9)}`,
        tagName: element.tagName.toLowerCase(),
        className: element.className,
        rect,
      };
      
      setHoveredElement(elementData);
      setOverlayPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
    };
    
    const handleClick = (e: MouseEvent) => {
      if (!isActive || !hoveredElement) return;
      
      e.preventDefault();
      e.stopPropagation();
      
      onSelectElement(hoveredElement);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick, true);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick, true);
    };
  }, [isActive, hoveredElement, onSelectElement]);
  
  if (!isActive || !hoveredElement) return null;
  
  return (
    <>
      {/* Highlight overlay */}
      <div
        ref={overlayRef}
        style={{
          position: 'absolute',
          top: `${overlayPosition.top}px`,
          left: `${overlayPosition.left}px`,
          width: `${overlayPosition.width}px`,
          height: `${overlayPosition.height}px`,
          border: '2px solid #3b82f6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      />
      
      {/* Element info tooltip */}
      <div
        style={{
          position: 'absolute',
          top: `${overlayPosition.top + overlayPosition.height}px`,
          left: `${overlayPosition.left}px`,
          transform: 'translateY(8px)',
          backgroundColor: '#1e40af',
          color: 'white',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '12px',
          zIndex: 10000,
          pointerEvents: 'none',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          maxWidth: '300px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        }}
      >
        {hoveredElement.tagName}
        {hoveredElement.className && (
          <span className="ml-1 text-blue-200">.{hoveredElement.className.split(' ')[0]}</span>
        )}
        <span className="ml-2 text-xs opacity-70">Click to select</span>
      </div>
    </>
  );
};

export default VisualInspector;
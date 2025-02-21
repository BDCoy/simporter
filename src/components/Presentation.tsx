import React, { useEffect, useRef } from 'react';
import Reveal from 'reveal.js';
import { Slide } from '@/lib/core/PresentationBuilder';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/white.css';

interface PresentationProps {
  slides: Slide[];
  options?: RevealOptions;
}

export function Presentation({ slides, options = {} }: PresentationProps) {
  const deckRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<Reveal.Api | null>(null);

  useEffect(() => {
    const initReveal = async () => {
      if (deckRef.current && !revealRef.current) {
        revealRef.current = new Reveal(deckRef.current, {
          hash: true,
          slideNumber: true,
          controls: true,
          progress: true,
          center: true,
          transition: 'slide',
          width: '100%',
          height: '100%',
          margin: 0.1,
          minScale: 0.2,
          maxScale: 2.0,
          ...options,
        });
        await revealRef.current.initialize();
      }
    };

    initReveal();

    return () => {
      if (revealRef.current) {
        revealRef.current.destroy();
        revealRef.current = null;
      }
    };
  }, [options]);

  useEffect(() => {
    if (revealRef.current) {
      revealRef.current.sync();
      revealRef.current.layout();
    }
  }, [slides]);

  if (!slides || slides.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        No slides available
      </div>
    );
  }

  return (
    <div className="reveal h-full" ref={deckRef}>
      <div className="slides">
        {slides.map((slide) => (
          <section 
            key={slide.id}
            data-background-color={slide.layout === 'title' ? '#2563eb' : '#ffffff'}
            className="bg-white dark:bg-gray-900 rounded-lg shadow-lg"
          >
            <h2 className={slide.layout === 'title' ? 'text-white' : ''}>{slide.title}</h2>
            {slide.elements.map((element, index) => {
              switch (element.type) {
                case 'chart':
                  return (
                    <div key={index} className="chart-container">
                      {/* Render chart using your preferred charting library */}
                      {element.content}
                    </div>
                  );
                case 'table':
                  return (
                    <div key={index} className="table-container">
                      {element.content}
                    </div>
                  );
                default:
                  return (
                    <div 
                      key={index}
                      dangerouslySetInnerHTML={{ __html: element.content }}
                      className="prose dark:prose-invert max-w-none"
                    />
                  );
              }
            })}
            {slide.notes && (
              <aside className="notes">{slide.notes}</aside>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
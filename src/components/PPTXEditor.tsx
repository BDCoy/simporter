import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Edit2, Eye } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import type { Slide as SlideType } from './types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      grid: {
        color: '#e2e8f0'
      }
    },
    x: {
      grid: {
        display: false
      }
    }
  }
};



function SlidePreview({ slide }: { slide: SlideType }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8 relative overflow-y-auto custom-scrollbar min-h-[600px]">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sticky top-0 bg-white z-10 pb-4 border-b">
        {slide.title}
      </h2>
      
      {slide.layout === "title" && (
        <>
          <div className="h-1.5 w-24 sm:w-32 bg-blue-600 mb-4 sm:mb-8 rounded-full"></div>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-4 sm:mb-8 font-light leading-relaxed">
            {slide.content}
          </p>
          {slide.elements.map((element, idx) => (
            element.type === "text" && (
              <p key={idx} className="text-base sm:text-lg text-gray-500 italic leading-relaxed">
                {element.content}
              </p>
            )
          ))}
        </>
      )}

      {slide.layout === "content" && slide.elements.map((element, idx) => {
        if (element.type === "text") {
          return (
            <div key={idx} className="space-y-3 sm:space-y-4">
              {element.content.split('\n').map((line: string, i: number) => (
                <div key={i} className="flex items-start gap-3 sm:gap-4 group hover:bg-blue-50 p-2 rounded-lg transition-colors">
                  <span className="text-blue-600 text-lg sm:text-xl flex-shrink-0 group-hover:scale-110 transition-transform">•</span>
                  <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">{line.replace('•', '').trim()}</p>
                </div>
              ))}
            </div>
          );
        }
        if (element.type === "chart" && element.content.type === "line") {
          const data = {
            labels: element.content.labels,
            datasets: [
              {
                data: element.content.values,
                borderColor: '#2563eb',
                backgroundColor: '#3b82f6',
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
              },
            ],
          };
          
          return (
            <div key={idx} className="mt-4 h-[300px] sm:h-[400px]">
              <Line options={chartOptions} data={data} />
            </div>
          );
        }
        if (element.type === "table") {
          return (
            <div key={idx} className="mt-4 sm:mt-6 overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-blue-600">
                  <tr>
                    {element.content[0].map((header: string, i: number) => (
                      <th key={i} className="px-3 sm:px-6 py-2 sm:py-4 text-left text-xs sm:text-sm font-semibold text-white uppercase tracking-wider whitespace-nowrap">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {element.content.slice(1).map((row: string[], i: number) => (
                    <tr key={i} className={`${i % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}>
                      {row.map((cell: string, j: number) => (
                        <td key={j} className="px-3 sm:px-6 py-2 sm:py-4 text-xs sm:text-sm text-gray-700 whitespace-nowrap">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        }
        return null;
      })}

      {slide.layout === "twoColumn" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-12">
          {slide.elements.map((element, idx) => (
            element.type === "text" && (
              <div key={idx} className="space-y-3 sm:space-y-4">
                {element.content.split('\n').map((line: string, i: number) => (
                  <div key={i} className="flex items-start gap-3 sm:gap-4 group hover:bg-blue-50 p-2 rounded-lg transition-colors">
                    <span className="text-blue-600 text-lg sm:text-xl flex-shrink-0 group-hover:scale-110 transition-transform">•</span>
                    <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">{line.replace('•', '').trim()}</p>
                  </div>
                ))}
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
}

function SlideThumbnail({ slide, isSelected, onClick }: { 
  slide: SlideType; 
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex-shrink-0 group transition-transform hover:scale-105 ${
        isSelected ? 'ring-2 ring-blue-500' : ''
      }`}
    >
      <div className="w-48 h-32 bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-4 h-full flex flex-col">
          <h3 className="text-sm font-medium truncate mb-1">{slide.title}</h3>
          <div className="flex-1 overflow-hidden">
            {slide.layout === "title" && (
              <div className="h-1 w-12 bg-blue-600 mb-2 rounded-full"></div>
            )}
            <p className="text-xs text-gray-500 line-clamp-2">{slide.content}</p>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-400">Slide {slide.id}</span>
            {slide.layout === "content" && slide.elements.some(e => e.type === "chart") && (
              <span className="text-xs text-blue-500">Chart</span>
            )}
          </div>
        </div>
      </div>
      <div className={`absolute inset-0 rounded-lg transition-colors ${
        isSelected 
          ? 'bg-blue-500/10' 
          : 'group-hover:bg-gray-500/5'
      }`} />
    </button>
  );
}

function App({ slidesData }) {
  const [slides, setSlides] = useState<SlideType[]>(slidesData);
  const [selectedSlide, setSelectedSlide] = useState<number>(0);
  const [showEditor, setShowEditor] = useState(false);
  const [previewKey, setPreviewKey] = useState(Date.now().toString());
  const slidesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPreviewKey(Date.now().toString());
  }, [slides, selectedSlide]);

  const scrollToSelectedSlide = useCallback(() => {
    if (slidesContainerRef.current) {
      const container = slidesContainerRef.current;
      const selectedElement = container.children[selectedSlide] as HTMLElement;
      
      if (selectedElement) {
        const containerWidth = container.offsetWidth;
        const elementLeft = selectedElement.offsetLeft;
        const elementWidth = selectedElement.offsetWidth;
        
        const scrollPosition = elementLeft - (containerWidth / 2) + (elementWidth / 2);
        
        container.scrollTo({
          left: scrollPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedSlide]);

  useEffect(() => {
    scrollToSelectedSlide();
  }, [selectedSlide, scrollToSelectedSlide]);

  const handleSlideContentChange = (index: number, field: keyof SlideType, value: string) => {
    const newSlides = [...slides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setSlides(newSlides);
  };

  const handleElementChange = (slideIndex: number, elementIndex: number, value: string) => {
    const newSlides = [...slides];
    if (newSlides[slideIndex].elements[elementIndex].type === "text") {
      newSlides[slideIndex].elements[elementIndex].content = value;
      setSlides(newSlides);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-end h-16 gap-4">
            <button
              onClick={() => setShowEditor(!showEditor)}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 rounded-lg transition-all hover:bg-gray-100"
            >
              {showEditor ? (
                <>
                  <Eye size={20} />
                  <span className="hidden sm:inline">Preview</span>
                </>
              ) : (
                <>
                  <Edit2 size={20} />
                  <span className="hidden sm:inline">Edit</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="relative mb-6">
          <div 
            ref={slidesContainerRef}
            className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar"
            style={{
              scrollbarWidth: 'thin',
              scrollbarColor: '#cbd5e1 #f1f5f9',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <div className="flex max-w-sm overflow-x-auto gap-4 px-4">
              {slides.map((slide, index) => (
                <div key={slide.id}>
                  <SlideThumbnail
                    slide={slide}
                    isSelected={selectedSlide === index}
                    onClick={() => setSelectedSlide(index)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {!showEditor && (
            <div className="bg-gray-800 rounded-xl p-4 sm:p-8 shadow-lg">
              <div className="bg-white rounded-lg shadow-xl">
                <SlidePreview key={previewKey} slide={slides[selectedSlide]} />
              </div>
            </div>
          )}

          {showEditor && (
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <h2 className="text-lg font-semibold mb-4 sm:mb-6 sticky top-0 bg-white pb-4 border-b">Edit Slide</h2>
              {slides[selectedSlide] && (
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={slides[selectedSlide].title}
                      onChange={(e) => handleSlideContentChange(selectedSlide, 'title', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content
                    </label>
                    <textarea
                      value={slides[selectedSlide].content}
                      onChange={(e) => handleSlideContentChange(selectedSlide, 'content', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  {slides[selectedSlide].elements.map((element, idx) => (
                    element.type === "text" && (
                      <div key={idx}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bullet Points
                        </label>
                        <textarea
                          value={element.content}
                          onChange={(e) => handleElementChange(selectedSlide, idx, e.target.value)}
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    )
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={slides[selectedSlide].notes}
                      onChange={(e) => handleSlideContentChange(selectedSlide, 'notes', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
import React, { useState, useEffect } from 'react';

interface FuturisticGaugeProps {
  score: number;
}

const FuturisticGauge: React.FC<FuturisticGaugeProps> = ({ score = 75 }) => {
  const [currentScore, setCurrentScore] = useState(0);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentScore(score);
    }, 500);
    return () => clearTimeout(timer);
  }, [score]);

  const calculateGaugePercentage = (value: number) => (value * 180) / 100;
  
  const getScoreColor = (value: number) => {
    if (value > 69) return "#22ffa2";
    if (value > 44) return "#ffcc15";
    return "#ff4444";
  };

  const mainColor = getScoreColor(currentScore);

  return (
    <div className="relative w-64 h-64 flex items-center justify-center">
      {/* Outer glow ring */}
      <div className="absolute w-full h-full rounded-full animate-pulse" 
           style={{
             background: `radial-gradient(circle, ${mainColor}22 0%, transparent 70%)`
           }} />

      {/* Main gauge container */}
      <div className="relative w-56 h-56">
        {/* Background elements */}
        <svg viewBox="0 0 100 100" className="absolute top-0 left-0 w-full h-full">
          {/* Grid pattern */}
          <pattern id="grid" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
            <path d="M 4 0 L 0 0 0 4" fill="none" stroke={`${mainColor}22`} strokeWidth="0.5" />
          </pattern>
          <circle cx="50" cy="50" r="48" fill="url(#grid)" />

          {/* Gauge track */}
          <path
            d="M10 75 A40 40 0 0 1 90 75"
            fill="none"
            stroke="#1a1a1a"
            strokeWidth="4"
            className="opacity-30"
          />

          {/* Dynamic score arc */}
          <path
            d="M10 75 A40 40 0 0 1 90 75"
            fill="none"
            stroke={mainColor}
            strokeWidth="4"
            strokeDasharray={`${calculateGaugePercentage(currentScore)} 180`}
            strokeLinecap="round"
            className="drop-shadow-lg"
            style={{
              filter: `drop-shadow(0 0 6px ${mainColor})`
            }}
          />

          {/* Decorative marks */}
          {[...Array(19)].map((_, i) => {
            const rotation = i * 10;
            const isLarge = i % 5 === 0;
            return (
              <line
                key={i}
                transform={`rotate(${rotation} 50 75)`}
                x1="50"
                y1="30"
                x2="50"
                y2={isLarge ? "35" : "33"}
                stroke={`${mainColor}88`}
                strokeWidth={isLarge ? "2" : "1"}
                className="opacity-60"
              />
            );
          })}
        </svg>

        {/* Central display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Holographic score display */}
          <div className="relative">
            <span className="text-5xl font-bold"
                  style={{
                    color: mainColor,
                    textShadow: `0 0 10px ${mainColor}`,
                  }}>
              {Math.round(currentScore)}
            </span>
            <span className="absolute -right-6 top-0 text-2xl" style={{ color: mainColor }}>%</span>
          </div>
          
          {/* Label */}
          <div className="mt-2 text-sm uppercase tracking-wider" style={{ color: `${mainColor}cc` }}>
            AI Score
          </div>

          {/* Dynamic scanner line */}
          <div className="absolute w-full h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-30"
               style={{ 
                 color: mainColor,
                 animation: 'scan 2s linear infinite',
               }} />
        </div>

        {/* Decorative corner elements */}
        {[0, 90, 180, 270].map((rotation) => (
          <div key={rotation} 
               className="absolute w-4 h-4 border-2 opacity-50"
               style={{
                 borderColor: mainColor,
                 transform: `rotate(${rotation}deg) translate(${rotation % 180 === 0 ? '-50%, -50%' : '50%, 50%'})`,
                 top: rotation < 180 ? '0' : '100%',
                 left: rotation < 90 || rotation > 270 ? '0' : '100%',
               }} />
        ))}
      </div>

      <style jsx>{`
        @keyframes scan {
          0% { transform: translateY(-100px) }
          100% { transform: translateY(100px) }
        }
      `}</style>
    </div>
  );
};

export default FuturisticGauge;
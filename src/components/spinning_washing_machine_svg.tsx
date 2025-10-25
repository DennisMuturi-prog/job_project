import { useState, useEffect } from 'react';
import { Stepper } from '@/App';
import useSound from 'use-sound';

export default function SpinningWashingMachineSvg() {
  const [isSpinning] = useState(true); // Auto-start spinning
  const { next } = Stepper.useStepper();
  const [playSound,{stop}] = useSound('/washing-machine-23412.mp3');

  useEffect(() => {
    playSound();
  }, [playSound]);
  useEffect(() => {
    // Auto-advance after 6 seconds
    const timer = setTimeout(() => {
      next();
      stop() // Move to next step
    }, 6000);

    return () => clearTimeout(timer);
  }, [next,stop]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="relative">
        <svg
          width="400"
          height="500"
          viewBox="0 0 400 500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Washing Machine Body */}
          <rect
            x="50"
            y="50"
            width="300"
            height="400"
            rx="20"
            fill="#E5E7EB"
            stroke="#9CA3AF"
            strokeWidth="3"
          />
          
          {/* Control Panel */}
          <rect
            x="50"
            y="50"
            width="300"
            height="80"
            rx="20"
            fill="#D1D5DB"
            stroke="#9CA3AF"
            strokeWidth="3"
          />
          
          {/* Detergent Tray */}
          <rect
            x="80"
            y="70"
            width="120"
            height="40"
            rx="5"
            fill="#6B7280"
            stroke="#374151"
            strokeWidth="2"
          />
          
          {/* Tray Compartments */}
          <line x1="120" y1="70" x2="120" y2="110" stroke="#374151" strokeWidth="2" />
          <line x1="160" y1="70" x2="160" y2="110" stroke="#374151" strokeWidth="2" />
          
          {/* Control Buttons */}
          <circle 
            cx="250" 
            cy="90" 
            r="15" 
            fill="#10B981"
            stroke="#047857"
            strokeWidth="2"
          />
          <circle cx="290" cy="90" r="15" fill="#EF4444" stroke="#B91C1C" strokeWidth="2" />
          <circle cx="320" cy="90" r="15" fill="#10B981" stroke="#047857" strokeWidth="2" />
          
          {/* Drum Window */}
          <circle
            cx="200"
            cy="280"
            r="120"
            fill="#1F2937"
            stroke="#111827"
            strokeWidth="4"
          />
          
          {/* Clip path for clothes inside drum */}
          <defs>
            <clipPath id="drumClip">
              <circle cx="200" cy="280" r="110" />
            </clipPath>
          </defs>
          
          {/* Clothes inside drum */}
          <g clipPath="url(#drumClip)">
            <g
              style={{
                transformOrigin: '200px 280px',
                animation: isSpinning ? 'spin 2s linear infinite' : 'none'
              }}
            >
              {/* Red T-shirt */}
              <g transform="translate(170, 250)">
                <path
                  d="M0,0 L-15,-5 L-20,10 L-15,25 L15,25 L20,10 L15,-5 Z"
                  fill="#DC2626"
                  stroke="#991B1B"
                  strokeWidth="1"
                />
                <rect x="-8" y="0" width="16" height="25" fill="#DC2626" />
              </g>

              {/* Blue Jeans */}
              <g transform="translate(220, 270)">
                <path
                  d="M-12,0 L-14,30 L-8,32 L-6,28 L6,28 L8,32 L14,30 L12,0 Z"
                  fill="#2563EB"
                  stroke="#1E40AF"
                  strokeWidth="1"
                />
                <line x1="-2" y1="0" x2="-2" y2="30" stroke="#1E40AF" strokeWidth="0.5" />
                <line x1="2" y1="0" x2="2" y2="30" stroke="#1E40AF" strokeWidth="0.5" />
              </g>

              {/* White Towel (folded) */}
              <g transform="translate(190, 300)">
                <rect
                  x="-20"
                  y="-8"
                  width="40"
                  height="16"
                  rx="2"
                  fill="#F3F4F6"
                  stroke="#D1D5DB"
                  strokeWidth="1"
                />
                <line x1="-20" y1="-3" x2="20" y2="-3" stroke="#D1D5DB" strokeWidth="0.5" />
                <line x1="-20" y1="3" x2="20" y2="3" stroke="#D1D5DB" strokeWidth="0.5" />
              </g>

              {/* Orange Socks (pair) */}
              <g transform="translate(210, 290)">
                <ellipse cx="-8" cy="0" rx="6" ry="10" fill="#F97316" stroke="#EA580C" strokeWidth="1" />
                <ellipse cx="8" cy="0" rx="6" ry="10" fill="#F97316" stroke="#EA580C" strokeWidth="1" />
                <rect x="-11" y="-8" width="6" height="4" fill="#F97316" />
                <rect x="5" y="-8" width="6" height="4" fill="#F97316" />
              </g>

              {/* Purple Hoodie */}
              <g transform="translate(195, 265)">
                <path
                  d="M0,-5 L-18,0 L-22,8 L-20,28 L-10,30 L10,30 L20,28 L22,8 L18,0 Z"
                  fill="#9333EA"
                  stroke="#7C3AED"
                  strokeWidth="1"
                />
                {/* Hood */}
                <path
                  d="M-8,-5 Q-12,-12 0,-15 Q12,-12 8,-5"
                  fill="#9333EA"
                  stroke="#7C3AED"
                  strokeWidth="1"
                />
                {/* Pocket */}
                <rect x="-8" y="10" width="16" height="12" rx="2" fill="#7C3AED" />
              </g>

              {/* Green Shirt (crumpled) */}
              <g transform="translate(215, 255)">
                <path
                  d="M0,0 Q-10,-3 -12,5 Q-10,15 -5,20 Q0,25 5,20 Q10,15 12,5 Q10,-3 0,0"
                  fill="#10B981"
                  stroke="#059669"
                  strokeWidth="1"
                />
                <ellipse cx="0" cy="10" rx="8" ry="12" fill="#10B981" />
              </g>

              {/* Yellow Shorts */}
              <g transform="translate(180, 285)">
                <path
                  d="M-10,0 L-12,15 L-8,18 L-4,15 L4,15 L8,18 L12,15 L10,0 Z"
                  fill="#FCD34D"
                  stroke="#F59E0B"
                  strokeWidth="1"
                />
                <line x1="0" y1="0" x2="0" y2="15" stroke="#F59E0B" strokeWidth="0.5" />
              </g>
            </g>
          </g>
          
          {/* Glass Window */}
          <circle
            cx="200"
            cy="280"
            r="110"
            fill="#60A5FA"
            fillOpacity="0.3"
            stroke="#3B82F6"
            strokeWidth="3"
          />
          
          {/* Animated Drum Holes */}
          <g
            style={{
              transformOrigin: '200px 280px',
              animation: isSpinning ? 'spin 2s linear infinite' : 'none'
            }}
          >
            {/* Inner Drum Holes Pattern */}
            {[...Array(24)].map((_, i) => {
              const angle = (i * 15 * Math.PI) / 180;
              const radius = 85;
              const cx = 200 + radius * Math.cos(angle);
              const cy = 280 + radius * Math.sin(angle);
              return (
                <circle
                  key={i}
                  cx={cx}
                  cy={cy}
                  r="4"
                  fill="#1F2937"
                />
              );
            })}
            
            {/* Center of drum */}
            <circle cx="200" cy="280" r="20" fill="#374151" />
          </g>
          
          {/* Door Handle */}
          <rect
            x="315"
            y="270"
            width="10"
            height="60"
            rx="5"
            fill="#6B7280"
            stroke="#374151"
            strokeWidth="2"
          />
        </svg>
        
        {/* Progress indicator */}
        <div className="mt-6 text-center">
          <p className="text-gray-700 font-bold text-2xl mb-3">Rinsing in progress...</p>
          <div className="w-96 h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-lg"
              style={{ animation: 'progress 6s linear forwards' }}
            />
          </div>
          <p className="text-gray-500 mt-3 text-lg">Please wait while the cycle completes</p>
        </div>
      </div>
      
      <style>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}

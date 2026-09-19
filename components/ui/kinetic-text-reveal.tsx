'use client';

import React, { useState, useRef } from 'react';

interface KineticProps {
  text: string;
  className?: string;
}

export function KineticTextReveal({ text, className = '' }: KineticProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const words = text.split(' ');

  return (
    <div 
      ref={containerRef}
      className={`inline-flex flex-wrap justify-center gap-x-2 select-none ${className}`}
      onMouseLeave={() => setHoveredIndex(null)}
    >
      {words.map((word, wIdx) => (
        <span key={wIdx} className="inline-flex whitespace-nowrap">
          {word.split('').map((char, cIdx) => {
            const globalIdx = wIdx * 20 + cIdx;
            const isHovered = hoveredIndex === globalIdx;
            const isNeighbor = 
              hoveredIndex !== null && 
              Math.abs(hoveredIndex - globalIdx) === 1;

            return (
              <span
                key={cIdx}
                onMouseEnter={() => setHoveredIndex(globalIdx)}
                className="inline-block transition-all duration-300 ease-out cursor-default"
                style={{
                  transform: isHovered
                    ? 'scale(1.35) translateY(-6px)'
                    : isNeighbor
                    ? 'scale(1.15) translateY(-2px)'
                    : 'scale(1) translateY(0)',
                  color: isHovered ? '#059669' : isNeighbor ? '#10b981' : 'inherit',
                  textShadow: isHovered ? '0 0 16px rgba(5, 150, 105, 0.3)' : 'none',
                }}
              >
                {char}
              </span>
            );
          })}
        </span>
      ))}
    </div>
  );
}

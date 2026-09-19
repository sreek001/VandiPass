'use client';

import React from 'react';

export function AnimatedBackgroundLines() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-35 z-0">
      <svg
        className="w-full h-full"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M -100 150 C 300 300, 700 50, 1540 200"
          stroke="rgba(16, 185, 129, 0.2)"
          strokeWidth="2"
          strokeDasharray="6 8"
        />
        <path
          d="M -100 450 C 400 350, 900 650, 1540 500"
          stroke="rgba(148, 163, 184, 0.25)"
          strokeWidth="1.5"
        />
        <path
          d="M -100 750 C 500 600, 800 850, 1540 700"
          stroke="rgba(16, 185, 129, 0.15)"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}

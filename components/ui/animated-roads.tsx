'use client';

import React from 'react';

export default function AnimatedRoads() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* ----------------- LEFT ROAD CORRIDOR ----------------- */}
      <svg
        className="absolute top-0 -left-12 w-[340px] sm:w-[460px] h-full"
        viewBox="0 0 460 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Main Left Route Path */}
          <path
            id="leftRoadPath1"
            d="M -30 -40 C 90 120, 260 180, 190 380 C 120 580, 310 680, 180 880 C 110 980, 220 1040, 260 1100"
          />
          {/* Secondary Inner Winding Path */}
          <path
            id="leftRoadPath2"
            d="M 60 -50 C -20 160, 140 280, 60 490 C -20 700, 160 820, 40 1050"
          />

          {/* KSRTC Red-and-Yellow Classic Bus Symbol */}
          <g id="ksrtcBus">
            {/* Bus Shadow */}
            <rect x="-14" y="-8" width="28" height="16" rx="4" fill="rgba(0,0,0,0.15)" />
            {/* Bus Body (KSRTC Signature Red / Maroon) */}
            <rect x="-13" y="-7" width="26" height="14" rx="3.5" fill="#dc2626" stroke="#991b1b" strokeWidth="0.8" />
            {/* Yellow Concession Livery Stripe */}
            <rect x="-13" y="-2" width="26" height="4" fill="#fbbf24" />
            {/* Front Windshield */}
            <rect x="7" y="-5" width="4" height="10" rx="1" fill="#e0f2fe" />
            {/* Passenger Windows */}
            <rect x="-10" y="-5.5" width="4" height="2" rx="0.5" fill="#e0f2fe" />
            <rect x="-4" y="-5.5" width="4" height="2" rx="0.5" fill="#e0f2fe" />
            <rect x="2" y="-5.5" width="4" height="2" rx="0.5" fill="#e0f2fe" />
            <rect x="-10" y="3.5" width="4" height="2" rx="0.5" fill="#e0f2fe" />
            <rect x="-4" y="3.5" width="4" height="2" rx="0.5" fill="#e0f2fe" />
            <rect x="2" y="3.5" width="4" height="2" rx="0.5" fill="#e0f2fe" />
            {/* Headlights */}
            <circle cx="12" cy="-4" r="1" fill="#fef08a" />
            <circle cx="12" cy="4" r="1" fill="#fef08a" />
          </g>

          {/* KSRTC Super Fast / Swift Green Bus */}
          <g id="ksrtcSwiftBus">
            <rect x="-14" y="-8" width="28" height="16" rx="4" fill="rgba(0,0,0,0.12)" />
            <rect x="-13" y="-7" width="26" height="14" rx="3.5" fill="#047857" stroke="#065f46" strokeWidth="0.8" />
            <rect x="-13" y="-2" width="26" height="4" fill="#fef08a" />
            <rect x="7" y="-5" width="4" height="10" rx="1" fill="#e0f2fe" />
          </g>
        </defs>

        {/* Outer Topography Contour Lines */}
        <path
          d="M -50 -40 C 70 120, 240 180, 170 380 C 100 580, 290 680, 160 880"
          stroke="#10b981"
          strokeWidth="1.2"
          strokeOpacity="0.15"
          fill="none"
        />

        {/* Road 1: Main Asphalt Lane */}
        <use href="#leftRoadPath1" stroke="#e2e8f0" strokeWidth="32" strokeLinecap="round" fill="none" />
        <use href="#leftRoadPath1" stroke="#cbd5e1" strokeWidth="26" strokeLinecap="round" fill="none" />
        {/* Yellow Broken Center Line */}
        <use href="#leftRoadPath1" stroke="#f59e0b" strokeWidth="2" strokeDasharray="8 14" fill="none" />

        {/* Road 2: Secondary Kerala Winding Route */}
        <use href="#leftRoadPath2" stroke="#f1f5f9" strokeWidth="22" strokeLinecap="round" fill="none" />
        <use href="#leftRoadPath2" stroke="#e2e8f0" strokeWidth="18" strokeLinecap="round" fill="none" />
        <use href="#leftRoadPath2" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 12" strokeOpacity="0.7" fill="none" />

        {/* Animated Bus 1 on Left Main Road (Downhill route) */}
        <use href="#ksrtcBus">
          <animateMotion
            dur="14s"
            repeatCount="indefinite"
            rotate="auto"
            keyPoints="0;1"
            keyTimes="0;1"
          >
            <mpath href="#leftRoadPath1" />
          </animateMotion>
        </use>

        {/* Animated Bus 2 on Left Secondary Road (Delayed start) */}
        <use href="#ksrtcSwiftBus">
          <animateMotion
            dur="18s"
            begin="-6s"
            repeatCount="indefinite"
            rotate="auto"
            keyPoints="0;1"
            keyTimes="0;1"
          >
            <mpath href="#leftRoadPath2" />
          </animateMotion>
        </use>
      </svg>

      {/* ----------------- RIGHT ROAD CORRIDOR ----------------- */}
      <svg
        className="absolute top-0 -right-12 w-[340px] sm:w-[460px] h-full"
        viewBox="0 0 460 1000"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <defs>
          {/* Main Right Route Path (Hairpin Curves) */}
          <path
            id="rightRoadPath1"
            d="M 480 -30 C 350 140, 180 220, 260 420 C 340 620, 150 720, 290 920 C 360 1020, 240 1080, 210 1120"
          />
          {/* Secondary Coastal / Feeder Route */}
          <path
            id="rightRoadPath2"
            d="M 390 -40 C 470 180, 290 320, 390 540 C 490 760, 300 880, 420 1060"
          />
        </defs>

        {/* Elevation Contour Lines */}
        <path
          d="M 500 -30 C 370 140, 200 220, 280 420 C 360 620, 170 720, 310 920"
          stroke="#059669"
          strokeWidth="1.2"
          strokeOpacity="0.15"
          fill="none"
        />

        {/* Road 1: Main Asphalt Highway */}
        <use href="#rightRoadPath1" stroke="#e2e8f0" strokeWidth="32" strokeLinecap="round" fill="none" />
        <use href="#rightRoadPath1" stroke="#cbd5e1" strokeWidth="26" strokeLinecap="round" fill="none" />
        {/* Yellow Broken Center Line */}
        <use href="#rightRoadPath1" stroke="#f59e0b" strokeWidth="2" strokeDasharray="8 14" fill="none" />

        {/* Road 2: Mountain Byway */}
        <use href="#rightRoadPath2" stroke="#f1f5f9" strokeWidth="22" strokeLinecap="round" fill="none" />
        <use href="#rightRoadPath2" stroke="#e2e8f0" strokeWidth="18" strokeLinecap="round" fill="none" />
        <use href="#rightRoadPath2" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="6 12" strokeOpacity="0.7" fill="none" />

        {/* Animated Bus 3 on Right Main Road */}
        <use href="#ksrtcBus">
          <animateMotion
            dur="16s"
            begin="-3s"
            repeatCount="indefinite"
            rotate="auto"
            keyPoints="0;1"
            keyTimes="0;1"
          >
            <mpath href="#rightRoadPath1" />
          </animateMotion>
        </use>

        {/* Animated Bus 4 on Right Secondary Road (Going uphill/reversed) */}
        <use href="#ksrtcSwiftBus">
          <animateMotion
            dur="20s"
            begin="-10s"
            repeatCount="indefinite"
            rotate="auto"
            keyPoints="1;0"
            keyTimes="0;1"
          >
            <mpath href="#rightRoadPath2" />
          </animateMotion>
        </use>
      </svg>
    </div>
  );
}

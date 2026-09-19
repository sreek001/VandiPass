"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import Link from "next/link";
import { ArrowUp, Shield, FileText } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function CinematicFooter() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !wrapperRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        giantTextRef.current,
        { y: "10vh", scale: 0.85, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 40%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div
      ref={wrapperRef}
      className="relative h-screen w-full"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <footer className="fixed bottom-0 left-0 flex h-screen w-full flex-col justify-between overflow-hidden bg-white text-slate-900 border-t border-slate-200">
        
        {/* BACKGROUND KERALA HIGHWAYS & RUNNING KSRTC BUSES */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          
          {/* Left Winding Corridor */}
          <svg
            className="absolute top-0 -left-10 w-[360px] sm:w-[480px] h-full opacity-60"
            viewBox="0 0 480 1000"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <path
                id="footerRoadLeft"
                d="M -30 -30 C 120 140, 260 200, 180 440 C 100 680, 290 760, 150 950 C 90 1020, 210 1080, 240 1120"
              />
              <g id="footerKsrtcBus">
                <rect x="-14" y="-8" width="28" height="16" rx="4" fill="rgba(0,0,0,0.18)" />
                <rect x="-13" y="-7" width="26" height="14" rx="3.5" fill="#dc2626" stroke="#991b1b" strokeWidth="0.8" />
                <rect x="-13" y="-2" width="26" height="4" fill="#fbbf24" />
                <rect x="7" y="-5" width="4" height="10" rx="1" fill="#e0f2fe" />
                <circle cx="12" cy="-4" r="1" fill="#fef08a" />
                <circle cx="12" cy="4" r="1" fill="#fef08a" />
              </g>
              <g id="footerSwiftBus">
                <rect x="-14" y="-8" width="28" height="16" rx="4" fill="rgba(0,0,0,0.15)" />
                <rect x="-13" y="-7" width="26" height="14" rx="3.5" fill="#047857" stroke="#065f46" strokeWidth="0.8" />
                <rect x="-13" y="-2" width="26" height="4" fill="#fef08a" />
                <rect x="7" y="-5" width="4" height="10" rx="1" fill="#e0f2fe" />
              </g>
            </defs>

            {/* Asphalt Lane */}
            <use href="#footerRoadLeft" stroke="#e2e8f0" strokeWidth="34" strokeLinecap="round" fill="none" />
            <use href="#footerRoadLeft" stroke="#cbd5e1" strokeWidth="26" strokeLinecap="round" fill="none" />
            <use href="#footerRoadLeft" stroke="#f59e0b" strokeWidth="2" strokeDasharray="8 14" fill="none" />

            {/* Running KSRTC Bus */}
            <use href="#footerKsrtcBus">
              <animateMotion
                dur="15s"
                repeatCount="indefinite"
                rotate="auto"
                keyPoints="0;1"
                keyTimes="0;1"
              >
                <mpath href="#footerRoadLeft" />
              </animateMotion>
            </use>
          </svg>

          {/* Right Winding Corridor */}
          <svg
            className="absolute top-0 -right-10 w-[360px] sm:w-[480px] h-full opacity-60"
            viewBox="0 0 480 1000"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
          >
            <defs>
              <path
                id="footerRoadRight"
                d="M 500 -30 C 360 160, 200 240, 280 480 C 360 700, 160 800, 310 980 C 370 1050, 230 1100, 190 1140"
              />
            </defs>

            {/* Asphalt Lane */}
            <use href="#footerRoadRight" stroke="#e2e8f0" strokeWidth="34" strokeLinecap="round" fill="none" />
            <use href="#footerRoadRight" stroke="#cbd5e1" strokeWidth="26" strokeLinecap="round" fill="none" />
            <use href="#footerRoadRight" stroke="#f59e0b" strokeWidth="2" strokeDasharray="8 14" fill="none" />

            {/* Running Swift Green Bus */}
            <use href="#footerSwiftBus">
              <animateMotion
                dur="17s"
                begin="-5s"
                repeatCount="indefinite"
                rotate="auto"
                keyPoints="0;1"
                keyTimes="0;1"
              >
                <mpath href="#footerRoadRight" />
              </animateMotion>
            </use>
          </svg>

          {/* Ambient Radial Gradient */}
          <div className="absolute left-1/2 top-1/2 h-[50vh] w-[70vw] -translate-x-1/2 -translate-y-1/2 bg-emerald-500/10 rounded-full blur-[110px]" />
        </div>

        {/* GIANT BACKGROUND WATERMARK */}
        <div
          ref={giantTextRef}
          className="absolute -bottom-[2vh] left-1/2 -translate-x-1/2 whitespace-nowrap text-[22vw] font-black text-slate-100 tracking-tighter select-none pointer-events-none z-0"
        >
          KSRTC
        </div>

        {/* 1. TOP MARQUEE */}
        <div className="absolute top-8 left-0 w-full overflow-hidden border-y border-slate-200 bg-white/85 backdrop-blur-md py-3 z-10 -rotate-1 scale-105 shadow-sm">
          <div className="flex w-max animate-footer-scroll-marquee text-xs font-mono font-bold tracking-widest text-slate-500 uppercase">
            <div className="flex items-center space-x-8 px-4">
              <span>Zero-Network Offline Verifier</span> <span>✦</span>
              <span>Fast Boarding Concession Protocol</span> <span>✦</span>
              <span>Ernakulam Corridor Integrated</span> <span>✦</span>
              <span>Luhn Modulo-36 Pass Integrity</span> <span>✦</span>
            </div>
            <div className="flex items-center space-x-8 px-4">
              <span>Zero-Network Offline Verifier</span> <span>✦</span>
              <span>Fast Boarding Concession Protocol</span> <span>✦</span>
              <span>Ernakulam Corridor Integrated</span> <span>✦</span>
              <span>Luhn Modulo-36 Pass Integrity</span> <span>✦</span>
            </div>
          </div>
        </div>

        {/* 2. MAIN CENTER CONTENT WITH ENLARGED TYPOGRAPHY */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 mt-16 max-w-4xl mx-auto text-center space-y-5">
          
          {/* Substantially Enlarged Typography */}
          <div className="w-[300px] sm:w-[420px] md:w-[500px] h-36 sm:h-48 flex items-center justify-center transition-transform hover:scale-105">
            <Image
              src="/typing.png"
              alt="വണ്ടിപാസ്സ്"
              width={600}
              height={260}
              className="object-contain w-full h-full filter contrast-125 drop-shadow-sm"
              priority
            />
          </div>

          <h2
            ref={headingRef}
            className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight"
          >
            Digital student transit concession.
          </h2>

          {/* Links Row */}
          <div ref={linksRef} className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/terms"
              className="px-5 py-2.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1.5 transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-600" />
              <span>Terms & Conditions</span>
            </Link>

            <Link
              href="/privacy"
              className="px-5 py-2.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Privacy Policy</span>
            </Link>

            <Link
              href="/login"
              className="px-5 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all"
            >
              Demo Accounts Portal
            </Link>
          </div>
        </div>

        {/* 3. CLEAN BOTTOM BAR (Ernakulam tag removed) */}
        <div className="relative z-20 w-full pb-6 px-6 sm:px-12 flex items-center justify-between border-t border-slate-200/80 bg-white/75 backdrop-blur-md">
          
          <div className="flex items-center gap-2.5">
            <div className="relative w-6 h-6 overflow-hidden">
              <Image src="/logo.png" alt="Favicon" width={24} height={24} className="object-contain" />
            </div>
            <span className="text-slate-500 text-xs font-mono">
              © 2026 VandiPass · KSRTC Motor Transport System
            </span>
          </div>

          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full border border-slate-200 bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
            title="Back to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>

      </footer>
    </div>
  );
}

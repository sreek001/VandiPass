'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { KineticTextReveal } from '@/components/ui/kinetic-text-reveal';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased relative selection:bg-emerald-600 selection:text-white overflow-hidden">
      
      {/* Background Radial Glow Accents */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-[700px] h-[380px] bg-emerald-300/20 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-teal-200/25 rounded-full blur-[120px]" />
        <div className="absolute -bottom-20 left-10 w-[500px] h-[500px] bg-sky-100/30 rounded-full blur-[120px]" />
      </div>

      <main className="relative z-10 max-w-5xl mx-auto px-4 py-8 sm:py-14 space-y-10">
        
        {/* Status Chip */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            KSRTC Digital Student Concession Registry
          </div>
        </div>

        {/* Hero Area: Large Seamless Logo + Kinetic Reveal */}
        <div className="flex flex-col items-center text-center space-y-5">
          
          {/* Logo with gentle emerald ambient glow */}
          <div className="relative group cursor-pointer transition-transform duration-300 hover:scale-105">
            <div className="absolute -inset-4 bg-emerald-400/20 rounded-full blur-2xl opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-72 sm:w-96 h-36 sm:h-44 flex items-center justify-center">
              <Image 
                src="/typing.png" 
                alt="വണ്ടിപാസ്സ് VandiPass Logo" 
                width={450} 
                height={200} 
                className="object-contain w-full h-full drop-shadow-md"
                priority
              />
            </div>
          </div>

          <div className="pt-2">
            <KineticTextReveal
              text="Fast, Offline Student Bus Passes"
              className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight"
            />
          </div>

          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-medium">
            Apply online, receive verified digital passes, and travel smoothly with instant offline verification.
          </p>
        </div>

        {/* 3 Matched Action Cards: Clean White & Emerald */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          
          {/* Card 1: Student Hub */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(5,150,105,0.12)] hover:border-emerald-300 transition-all flex flex-col justify-between space-y-6 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono font-bold">
                  STAGE 01
                </span>
                <span className="text-xs font-mono text-slate-400 font-semibold">STUDENT</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                Student Hub
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Apply for a new pass, check approval status, and present your digital QR pass.
              </p>
            </div>
            <Link 
              href="/student"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold text-center shadow-md hover:shadow-emerald-700/25 transition-all"
            >
              Open Student Hub
            </Link>
          </div>

          {/* Card 2: Depot Desk */}
          <div className="p-7 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_12px_32px_rgba(5,150,105,0.12)] hover:border-emerald-300 transition-all flex flex-col justify-between space-y-6 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-mono font-bold">
                  STAGE 02
                </span>
                <span className="text-xs font-mono text-slate-400 font-semibold">DEPOT</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                Depot Desk
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Review student applications, verify routes, and issue signed digital passes.
              </p>
            </div>
            <Link 
              href="/depot"
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-emerald-700 text-white text-xs font-bold text-center shadow-md hover:shadow-emerald-700/25 transition-all"
            >
              Open Depot Desk
            </Link>
          </div>

          {/* Card 3: Conductor Scanner */}
          <div className="p-7 rounded-3xl bg-white border border-emerald-200 shadow-[0_4px_20px_rgb(5,150,105,0.06)] hover:shadow-[0_12px_32px_rgba(5,150,105,0.16)] hover:border-emerald-400 transition-all flex flex-col justify-between space-y-6 group">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[11px] font-mono font-bold shadow-sm shadow-emerald-600/30">
                  STAGE 03
                </span>
                <span className="text-xs font-mono text-emerald-700 font-bold">AIR-GAPPED</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Conductor Scanner
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                Scan passes in real time. Works completely offline with instant pass clearance.
              </p>
            </div>
            <Link 
              href="/conductor"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold text-center shadow-lg shadow-emerald-600/30 transition-all"
            >
              Launch Scanner
            </Link>
          </div>

        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-slate-200 text-center text-xs text-slate-500 font-mono">
          Kerala State Road Transport Corporation · VandiPass
        </div>

      </main>
    </div>
  );
}

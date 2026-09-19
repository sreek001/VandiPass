'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { KineticTextReveal } from '@/components/ui/kinetic-text-reveal';
import AnimatedRoads from '@/components/ui/animated-roads';
import { ArrowRight, UserCheck, ShieldCheck, QrCode } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-80px)] bg-white text-slate-900 overflow-hidden">
      
      {/* Animated Kerala Mountain Highways with cruising KSRTC buses */}
      <AnimatedRoads />

      <main className="relative z-10 max-w-5xl mx-auto px-4 pt-8 pb-16 space-y-8">
        
        {/* Hero Section: Centered Big Calligraphy */}
        <div className="flex flex-col items-center text-center space-y-4">
          
          <div className="relative group cursor-pointer transition-transform duration-300 hover:scale-105">
            <div className="w-[320px] sm:w-[480px] md:w-[580px] h-44 sm:h-60 flex items-center justify-center">
              <Image
                src="/typing.png"
                alt="വണ്ടിപാസ്സ്"
                width={700}
                height={320}
                className="object-contain w-full h-full filter contrast-125"
                priority
              />
            </div>
          </div>

          <div>
            <KineticTextReveal
              text="Fast, Offline Student Bus Passes"
              className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight"
            />
          </div>

          <p className="text-slate-600 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
            Apply online, receive verified digital passes, and travel smoothly with instant offline verification.
          </p>
        </div>

        {/* 3 Action Hub Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4">
          
          {/* Card 1: Student Hub */}
          <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-sm border border-slate-200 shadow-sm flex flex-col justify-between space-y-5 hover:border-slate-300 hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Student Hub</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Apply for a new concession, track review progress, and present your active pass card.
              </p>
            </div>
            <Link
              href="/student"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <span>Open Student Hub</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 2: Depot Desk */}
          <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-sm border border-slate-200 shadow-sm flex flex-col justify-between space-y-5 hover:border-slate-300 hover:shadow-md transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Depot Desk</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inspect institutional records, examine uploaded ID proofs, and issue verified passes.
              </p>
            </div>
            <Link
              href="/depot"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <span>Open Depot Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Card 3: Conductor Scanner */}
          <div className="p-6 rounded-3xl bg-white/90 backdrop-blur-sm border border-emerald-200 shadow-sm flex flex-col justify-between space-y-5 hover:border-emerald-300 transition-all">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <QrCode className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Conductor Scanner</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Instant Google Pay speed QR scanner for rapid physical commuter boarding.
              </p>
            </div>
            <Link
              href="/conductor"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
            >
              <span>Launch Scanner</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

        {/* Minimal Footer */}
        <div className="pt-8 border-t border-slate-200 text-center text-xs text-slate-400 font-mono">
          Kerala State Road Transport Corporation · VandiPass
        </div>

      </main>
    </div>
  );
}

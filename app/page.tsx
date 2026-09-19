'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { KineticTextReveal } from '@/components/ui/kinetic-text-reveal';
import AnimatedRoads from '@/components/ui/animated-roads';
import { AnimatedBackgroundLines } from '@/components/ui/background-paths';
import { ArrowRight, UserCheck, ShieldCheck, QrCode, LogOut } from 'lucide-react';

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('vandipass_user');
    if (saved) setCurrentUser(saved);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('vandipass_user');
    setCurrentUser(null);
  };

  const isStudent = currentUser && !currentUser.includes('depot') && !currentUser.includes('conductor');
  const isDepot = currentUser && currentUser.includes('depot');
  const isConductor = currentUser && currentUser.includes('conductor');

  return (
    <div className="relative min-h-[calc(100vh-80px)] bg-white text-slate-900 overflow-hidden">
      <AnimatedBackgroundLines />
      <AnimatedRoads />

      <main className="relative z-10 max-w-5xl mx-auto px-4 pt-6 pb-16 space-y-8">
        
        {/* Active Role Indicator (if logged in) */}
        {currentUser && (
          <div className="flex justify-between items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-500 font-mono">Logged in as:</span>
              <span className="font-bold text-slate-800">{currentUser}</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase">
                {isStudent ? 'Student' : isDepot ? 'Depot Officer' : 'Conductor'}
              </span>
            </div>
            <button
              onClick={handleSignOut}
              className="text-slate-400 hover:text-rose-600 font-bold flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        )}

        {/* Hero Section */}
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

        {/* The 3 Portals */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4">
          
          {/* Card 1: Student Hub */}
          <div className={`p-6 rounded-3xl bg-white/90 backdrop-blur-sm border shadow-sm flex flex-col justify-between space-y-5 transition-all ${
            isStudent ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200 hover:border-slate-300'
          }`}>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Student Hub</h2>
                {isStudent && <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Your Portal</span>}
              </div>
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
          <div className={`p-6 rounded-3xl bg-white/90 backdrop-blur-sm border shadow-sm flex flex-col justify-between space-y-5 transition-all ${
            isDepot ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-slate-200 hover:border-slate-300'
          }`}>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Depot Desk</h2>
                {isDepot && <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">Your Desk</span>}
              </div>
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
          <div className={`p-6 rounded-3xl bg-white/90 backdrop-blur-sm border shadow-sm flex flex-col justify-between space-y-5 transition-all ${
            isConductor ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-emerald-200 hover:border-emerald-300'
          }`}>
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <QrCode className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">Conductor Scanner</h2>
                {isConductor && <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">Your Scanner</span>}
              </div>
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

      </main>
    </div>
  );
}

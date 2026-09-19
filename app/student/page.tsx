'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function StudentPage() {
  const [tab, setTab] = useState<'pass' | 'apply'>('pass');
  const [name, setName] = useState('Tony Davis');
  const [institution, setInstitution] = useState('ASIET Kalady');
  const [route, setRoute] = useState('Aluva ⇄ Kalady');
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-md space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center pt-2">
          <div>
            <span className="text-[11px] font-mono font-bold text-emerald-700 uppercase tracking-wider">
              COMMUTER WALLET
            </span>
            <h1 className="text-2xl font-black text-slate-900">My Pass</h1>
          </div>
          <span className="px-3 py-1 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] font-mono font-bold text-emerald-800 shadow-sm">
            KL-26-4874
          </span>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-200/80 p-1.5 rounded-2xl border border-slate-200">
          <button
            onClick={() => setTab('pass')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'pass' 
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Digital Pass
          </button>
          <button
            onClick={() => setTab('apply')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === 'apply' 
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            New Application
          </button>
        </div>

        {/* Tab 1: Live Digital Card */}
        {tab === 'pass' && (
          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-5">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-wider">
                  KSRTC CONCESSION
                </span>
                <h2 className="text-xl font-black text-slate-900">{name}</h2>
                <p className="text-xs font-bold text-emerald-700">{route}</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold border border-emerald-200">
                ACTIVE
              </span>
            </div>

            {/* QR Card */}
            <div className="flex justify-center p-5 bg-slate-50 border border-slate-100 rounded-2xl shadow-inner">
              <QRCodeSVG 
                value={`VANDIPASS_KL-26-4874_${name.toUpperCase().replace(/\s+/g, '_')}`} 
                size={180} 
                level="M" 
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono border-t border-slate-100 pt-3">
              <div>
                <span className="text-slate-400 text-[10px] block font-semibold">INSTITUTION</span>
                <span className="text-slate-800 font-bold truncate block">{institution}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-semibold">VALID UNTIL</span>
                <span className="text-emerald-700 font-bold block">31-MAR-2027</span>
              </div>
            </div>

            <div className="text-center text-[11px] font-mono font-semibold text-emerald-700 bg-emerald-50/60 py-1.5 rounded-xl border border-emerald-100">
              ✓ Ready for offline scanning on bus
            </div>
          </div>
        )}

        {/* Tab 2: Enrolment Form */}
        {tab === 'apply' && (
          <div className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] space-y-4">
            <h2 className="text-base font-bold text-slate-900">Apply for Concession</h2>
            
            {submitted ? (
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                <span className="text-emerald-800 font-bold text-sm block">Application Submitted</span>
                <p className="text-xs text-slate-600">Your application has been forwarded to the depot for verification.</p>
                <button
                  onClick={() => { setSubmitted(false); setTab('pass'); }}
                  className="mt-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-sm"
                >
                  View My Pass
                </button>
              </div>
            ) : (
              <form 
                onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} 
                className="space-y-3.5 text-xs"
              >
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">College / School Name</label>
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-semibold mb-1">Travel Corridor (Origin ⇄ Destination)</label>
                  <input
                    type="text"
                    required
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md shadow-emerald-600/25 mt-2"
                >
                  Submit Application
                </button>
              </form>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

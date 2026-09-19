'use client';

import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function StudentPage() {
  const [tab, setTab] = useState<'pass' | 'apply'>('pass');

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800">
      <div className="max-w-md mx-auto px-4 py-8 space-y-6">
        
        {/* Simple Tab Control */}
        <div className="flex bg-slate-200/70 p-1 rounded-xl">
          <button
            onClick={() => setTab('pass')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'pass' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            My Pass
          </button>
          <button
            onClick={() => setTab('apply')}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
              tab === 'apply' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
            }`}
          >
            Apply
          </button>
        </div>

        {tab === 'pass' ? (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-5">
            <div className="flex justify-between items-start border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">KSRTC Pass</span>
                <h2 className="text-xl font-black text-slate-900">Tony Davis</h2>
                <p className="text-xs font-bold text-emerald-700">Aluva ⇄ Kalady</p>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                ACTIVE
              </span>
            </div>

            {/* Clean QR Display */}
            <div className="flex justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <QRCodeSVG value="VANDIPASS_KL-26-4874_TONY_DAVIS" size={180} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-100 pt-3 text-slate-600">
              <div>
                <span className="text-slate-400 block text-[10px]">Pass ID</span>
                <span className="font-bold text-slate-800">KL-26-4874</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Institution</span>
                <span className="font-bold text-slate-800 truncate block">ASIET Kalady</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 block text-[10px]">Valid Until</span>
                <span className="font-bold text-slate-800">31 March 2027</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Apply for Student Pass</h2>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Full Name</label>
                <input type="text" placeholder="e.g. Tony Davis" className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">College / School</label>
                <input type="text" placeholder="e.g. ASIET Kalady" className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Travel Route</label>
                <input type="text" placeholder="e.g. Aluva to Kalady" className="w-full px-3 py-2 border rounded-xl" />
              </div>
              <button className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold mt-2">
                Submit Application
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

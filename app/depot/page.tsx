'use client';

import React, { useState } from 'react';

interface Application {
  id: string;
  name: string;
  institution: string;
  route: string;
  status: 'PENDING' | 'ISSUED';
}

const INITIAL_APPS: Application[] = [
  { id: 'KL-26-4874', name: 'Tony Davis', institution: 'ASIET Kalady', route: 'Aluva ⇄ Kalady', status: 'PENDING' },
  { id: 'KL-26-1982', name: 'Meera Krishnan', institution: 'CET Trivandrum', route: 'Trivandrum Central ⇄ Engineering College', status: 'PENDING' },
  { id: 'KL-26-8091', name: 'Arjun Nair', institution: 'NIT Calicut', route: 'Calicut ⇄ NIT Campus', status: 'PENDING' },
];

export default function DepotPage() {
  const [apps, setApps] = useState<Application[]>(INITIAL_APPS);

  const handleApprove = (id: string) => {
    setApps(apps.map(a => a.id === id ? { ...a, status: 'ISSUED' } : a));
  };

  const pendingCount = apps.filter(a => a.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-6">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <span className="text-[11px] font-mono font-bold text-emerald-700 uppercase tracking-wider">
              DEPOT 042 · ALUVA
            </span>
            <h1 className="text-2xl font-black text-slate-900">Application Queue</h1>
          </div>
          <span className="px-3.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-bold shadow-sm">
            {pendingCount} PENDING
          </span>
        </div>

        {/* Application Cards */}
        <div className="space-y-3">
          {apps.map((app) => (
            <div 
              key={app.id} 
              className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-[0_4px_20px_rgb(0,0,0,0.02)] hover:border-emerald-300 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-base">{app.name}</span>
                  <span className="text-xs text-slate-400 font-mono">({app.id})</span>
                </div>
                <div className="text-xs text-slate-500 font-medium">{app.institution}</div>
                <div className="text-xs font-bold text-emerald-700 font-mono">{app.route}</div>
              </div>

              <div>
                {app.status === 'PENDING' ? (
                  <button
                    onClick={() => handleApprove(app.id)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
                  >
                    Approve & Issue
                  </button>
                ) : (
                  <span className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold inline-block">
                    ✓ ISSUED
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

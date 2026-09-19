'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  getOrCreateDepotKeypair,
  signPass,
  saveMyPass,
  getSharedApplications,
  saveSharedApplications,
  resetSharedApplications,
  type Application,
  type PassPayload,
} from '@/lib/crypto';

type CardPhase = 'idle' | 'verifying' | 'issuing' | 'issued';

const CHECK_STEPS = ['Student details', 'Institution', 'Enrolment proof', 'Route'];

function formatExpiry(unixSec: number): string {
  return new Date(unixSec * 1000)
    .toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase()
    .replace(/ /g, '-');
}

const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

export default function DepotPage() {
  const [apps, setApps]           = useState<Application[]>([]);
  const [phases, setPhases]       = useState<Record<string, CardPhase>>({});
  const [stepsDone, setStepsDone] = useState<Record<string, number>>({});
  const [expiries, setExpiries]   = useState<Record<string, string>>({});
  const [filter, setFilter]       = useState<'ALL' | 'PENDING' | 'ISSUED'>('ALL');
  const [feedback, setFeedback]   = useState<{ id: string; name: string; passId: string; timestamp: string } | null>(null);

  const reloadApps = useCallback(() => {
    setApps(getSharedApplications());
  }, []);

  useEffect(() => {
    reloadApps();

    window.addEventListener('storage', reloadApps);
    window.addEventListener('vandipass_apps_updated', reloadApps);
    window.addEventListener('focus', reloadApps);
    const handleVis = () => {
      if (document.visibilityState === 'visible') reloadApps();
    };
    document.addEventListener('visibilitychange', handleVis);
    const interval = setInterval(reloadApps, 1500);

    return () => {
      window.removeEventListener('storage', reloadApps);
      window.removeEventListener('vandipass_apps_updated', reloadApps);
      window.removeEventListener('focus', reloadApps);
      document.removeEventListener('visibilitychange', handleVis);
      clearInterval(interval);
    };
  }, [reloadApps]);

  const pendingCount = apps.filter(
    a => a.status === 'PENDING' && (!phases[a.id] || phases[a.id] === 'idle')
  ).length;

  const issuedCount = apps.filter(
    a => a.status === 'ISSUED' || phases[a.id] === 'issued'
  ).length;

  const filteredApps = apps.filter(a => {
    const isIss = a.status === 'ISSUED' || phases[a.id] === 'issued';
    if (filter === 'PENDING') return !isIss;
    if (filter === 'ISSUED') return isIss;
    return true;
  });

  const handleApprove = useCallback(async (app: Application) => {
    const id = app.id;
    setPhases(p  => ({ ...p,  [id]: 'verifying' }));
    setStepsDone(s => ({ ...s, [id]: 0 }));
    for (let i = 1; i <= CHECK_STEPS.length; i++) {
      await sleep(400);
      setStepsDone(s => ({ ...s, [id]: i }));
    }
    await sleep(250);
    setPhases(p => ({ ...p, [id]: 'issuing' }));

    const nowSec = Math.floor(Date.now() / 1000);
    const expSec = nowSec + 365 * 24 * 3600;
    const passId = app.passId || 'KL-26-4874';
    const payload: PassPayload = {
      pid: passId,
      sid: 'STU-' + app.id.replace(/[^0-9]/g, '').slice(-4),
      rid: 'RT-' + app.route.substring(0, 3).toUpperCase() + '-042',
      nam: app.studentName,
      ins: app.college,
      rou: app.route,
      iat: nowSec,
      exp: expSec,
    };
    const keypair = await getOrCreateDepotKeypair();
    const token   = await signPass(payload, keypair.privateKeyJwk);
    await sleep(600);

    setExpiries(e => ({ ...e, [id]: formatExpiry(expSec) }));
    setPhases(p  => ({ ...p,  [id]: 'issued' }));

    // Update shared applications in localStorage
    const currentList = getSharedApplications();
    const updatedList = currentList.map(a =>
      a.id === id ? { ...a, status: 'ISSUED' as const, token, passId, payload } : a
    );
    saveSharedApplications(updatedList);
    setApps(updatedList);

    // Save for student pass
    if (app.id === 'APP-001' || app.studentName.toLowerCase().includes('tony')) {
      saveMyPass(token, payload);
    }

    // Set confirmation feedback
    const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setFeedback({
      id: app.id,
      name: app.studentName,
      passId,
      timestamp: nowTime,
    });
  }, []);

  const handleResetQueue = useCallback(() => {
    const reset = resetSharedApplications();
    setApps(reset);
    setPhases({});
    setStepsDone({});
    const nowTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setFeedback({
      id: 'QUEUE-RESET',
      name: 'Queue Adjusted: 2 Pending, 1 Issued',
      passId: 'KL-26-4874',
      timestamp: nowTime,
    });
  }, []);

  const handleMarkPending = useCallback((appId: string) => {
    const currentList = getSharedApplications();
    const updated = currentList.map(a =>
      a.id === appId
        ? { ...a, status: 'PENDING' as const, token: undefined, passId: undefined, payload: undefined }
        : a
    );
    saveSharedApplications(updated);
    setApps(updated);
    setPhases(p => ({ ...p, [appId]: 'idle' }));
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-6">

        {/* Official Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold border border-emerald-300">
                  DEPOT 042
                </span>
                <span className="text-[11px] font-mono font-semibold text-slate-500 uppercase tracking-wider">
                  ALUVA REGIONAL DESK · ERNAKULAM
                </span>
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
                Concession Verification &amp; Issue Console
              </h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                {pendingCount} PENDING
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-mono font-bold shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                {issuedCount} ISSUED
              </span>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 text-xs font-mono pt-1 text-slate-600">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
              <span className="text-[10px] text-slate-400 block font-semibold">SECURITY PROTOCOL</span>
              <span className="font-bold text-slate-800">ECDSA P-256 Asymmetric</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
              <span className="text-[10px] text-slate-400 block font-semibold">SIGNING AUTHORITY</span>
              <span className="font-bold text-emerald-700">Depot Officer #042</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/70">
              <span className="text-[10px] text-slate-400 block font-semibold">OPERATIONAL STATUS</span>
              <span className="font-bold text-emerald-700">Active &amp; Online</span>
            </div>
          </div>
        </div>

        {/* Confirmation Feedback Banner after Approval */}
        {feedback && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 flex items-start justify-between gap-3 shadow-sm animate-in fade-in slide-in-from-top duration-300">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shrink-0 mt-0.5">
                ✓
              </span>
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-emerald-900">
                  Pass Approved &amp; Cryptographically Signed
                </div>
                <div className="text-xs text-emerald-800 mt-0.5 font-medium">
                  Concession Pass <span className="font-bold font-mono">{feedback.passId}</span> issued for <span className="font-bold">{feedback.name}</span>.
                </div>
                <div className="text-[10px] font-mono text-emerald-700 mt-1">
                  Reference: {feedback.id} · Timestamp: {feedback.timestamp} IST · Stored in shared registry
                </div>
              </div>
            </div>
            <button
              onClick={() => setFeedback(null)}
              className="text-emerald-700 hover:text-emerald-900 text-xs font-bold px-2 py-1 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Filter Navigation Tabs */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5 bg-slate-200/70 p-1 rounded-xl border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Applications ({apps.length})
            </button>
            <button
              onClick={() => setFilter('PENDING')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'PENDING' ? 'bg-white text-amber-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              onClick={() => setFilter('ISSUED')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                filter === 'ISSUED' ? 'bg-white text-emerald-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Issued Passes ({issuedCount})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetQueue}
              className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-300 text-xs font-semibold text-amber-900 transition-colors shadow-sm flex items-center gap-1.5"
              title="Reset queue to default (2 Pending, 1 Issued)"
            >
              <span>↺</span>
              <span>Reset to 2 Pending</span>
            </button>
            <button
              onClick={reloadApps}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              Refresh Queue
            </button>
          </div>
        </div>

        {/* Queue Items */}
        <div className="space-y-3">
          {filteredApps.length === 0 ? (
            /* Professional Empty State */
            <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.75">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                {filter === 'PENDING' ? 'No Pending Applications' : 'No Concession Records Found'}
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {filter === 'PENDING' 
                  ? 'All student concession requests submitted to Aluva Depot (042) have been processed and issued.' 
                  : 'No applications match the current filter selection.'}
              </p>
              {filter !== 'ALL' && (
                <button
                  onClick={() => setFilter('ALL')}
                  className="mt-1 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
                >
                  View All Records
                </button>
              )}
            </div>
          ) : (
            filteredApps.map((app) => {
              const phase    = phases[app.id] ?? (app.status === 'ISSUED' ? 'issued' : 'idle');
              const steps    = stepsDone[app.id] ?? 0;
              const isProc   = phase === 'verifying' || phase === 'issuing';
              const isIssued = phase === 'issued' || app.status === 'ISSUED';
              
              return (
                <div 
                  key={app.id} 
                  className={`p-5 rounded-2xl bg-white border transition-all ${
                    isIssued 
                      ? 'border-emerald-200 shadow-sm' 
                      : isProc 
                      ? 'border-blue-300 shadow-md ring-1 ring-blue-100' 
                      : 'border-slate-200 shadow-sm hover:border-slate-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-bold text-slate-900 text-base">{app.studentName}</span>
                        <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-700 text-[11px] font-mono font-bold">
                          {app.id}
                        </span>
                        {isIssued ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[10px] font-mono font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            VERIFIED &amp; ISSUED
                          </span>
                        ) : isProc ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-300 text-blue-800 text-[10px] font-mono font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                            VERIFYING
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-[10px] font-mono font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            PENDING VERIFICATION
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-600 font-medium">
                        Institution: <span className="font-bold text-slate-800">{app.college}</span>
                      </div>
                      
                      <div className="text-xs font-mono text-emerald-800 font-bold bg-emerald-50/70 px-2.5 py-1 rounded-lg border border-emerald-200/80 inline-block">
                        Route: {app.route}
                      </div>

                      {isIssued && (
                        <div className="flex items-center gap-2 text-xs font-mono pt-1 text-slate-600">
                          <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                            <span>✓</span>
                            <span>ISSUED</span>
                          </span>
                          <span className="text-slate-300">|</span>
                          <span>Valid Until: <strong className="text-slate-800 font-bold">{expiries[app.id] || (app.payload?.exp ? new Date(app.payload.exp * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase().replace(/ /g, '-') : '31-MAR-2027')}</strong></span>
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      {!isIssued && phase === 'idle' && (
                        <button 
                          onClick={() => handleApprove(app)} 
                          className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm border border-emerald-800 flex items-center gap-1.5"
                        >
                          <span>✓</span>
                          <span>Approve &amp; Issue Pass</span>
                        </button>
                      )}

                      {isProc && (
                        <span className="px-3 py-2 rounded-xl bg-blue-50 text-blue-800 border border-blue-200 text-xs font-mono font-bold inline-flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                          Processing…
                        </span>
                      )}

                      {isIssued && (
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 text-xs font-mono font-bold inline-block shadow-sm">
                            Pass ID: {app.passId || 'KL-26-4874'}
                          </span>
                          {app.id !== 'APP-001' && (
                            <button
                              onClick={() => handleMarkPending(app.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors border border-slate-200"
                              title="Reset this pass back to pending"
                            >
                              Mark Pending
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Verification Pipeline Progress (only shown while processing approval) */}
                  {isProc && (
                    <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2.5">
                      <div className="text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 text-blue-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Verifying Concession Eligibility…
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {CHECK_STEPS.map((step, i) => (
                          <div 
                            key={step} 
                            className={`p-2 rounded-lg border text-xs font-mono flex items-center gap-1.5 transition-all duration-300 ${
                              steps > i 
                                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800 font-bold' 
                                : 'bg-slate-50 border-slate-200 text-slate-400'
                            }`}
                          >
                            <span className="w-3 text-center">{steps > i ? '✓' : '○'}</span>
                            <span className="truncate">{step}</span>
                          </div>
                        ))}
                      </div>

                      {phase === 'issuing' && (
                        <div className="text-[11px] font-mono font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5 bg-amber-50 p-2 rounded-lg border border-amber-200">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                          Cryptographically signing pass with Depot Private Key…
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <footer className="pt-4 border-t border-slate-200 text-center text-xs text-slate-500 font-mono">
          Kerala State Road Transport Corporation · Public Transport Pass Office
        </footer>
      </div>
    </div>
  );
}
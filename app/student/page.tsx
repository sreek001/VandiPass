'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  getStudentApplication,
  saveStudentApplication,
  type Application,
} from '@/lib/crypto';

export default function StudentPage() {
  const [tab, setTab] = useState<'pass' | 'apply'>('pass');
  const [currentApp, setCurrentApp] = useState<Application | null>(null);
  const [showSecurityProof, setShowSecurityProof] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);

  // Application form fields
  const [name, setName] = useState('Tony Davis');
  const [institution, setInstitution] = useState('ASIET Kalady');
  const [route, setRoute] = useState('Aluva ⇄ Kalady');
  const [submitted, setSubmitted] = useState(false);
  const [idCard, setIdCard] = useState<File | null>(null);
  const [idCardError, setIdCardError] = useState('');

  const syncApplication = useCallback(() => {
    const app = getStudentApplication();
    setCurrentApp(app);
    if (app) {
      setName(app.studentName);
      setInstitution(app.college);
      setRoute(app.route);
    }
  }, []);

  useEffect(() => {
    syncApplication();

    window.addEventListener('storage', syncApplication);
    window.addEventListener('vandipass_apps_updated', syncApplication);
    window.addEventListener('focus', syncApplication);
    const handleVis = () => {
      if (document.visibilityState === 'visible') syncApplication();
    };
    document.addEventListener('visibilitychange', handleVis);
    const interval = setInterval(syncApplication, 1000);

    return () => {
      window.removeEventListener('storage', syncApplication);
      window.removeEventListener('vandipass_apps_updated', syncApplication);
      window.removeEventListener('focus', syncApplication);
      document.removeEventListener('visibilitychange', handleVis);
      clearInterval(interval);
    };
  }, [syncApplication]);

  const isIssued = currentApp?.status === 'ISSUED' && !!currentApp.token;
  const payload = currentApp?.payload;
  const token = currentApp?.token || '';
  const signaturePart = token.split('.')[1] || '';

  const validUntilStr = payload
    ? new Date(payload.exp * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase().replace(/ /g, '-')
    : '31-MAR-2027';

  const validFromStr = payload?.iat
    ? new Date(payload.iat * 1000).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase().replace(/ /g, '-')
    : '01-APR-2026';

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idCard) {
      setIdCardError('Please upload your College ID Card.');
      return;
    }
    setIdCardError('');

    const newApp: Application = {
      id: currentApp?.id || 'APP-001',
      studentName: name.trim() || 'Tony Davis',
      college: institution.trim() || 'ASIET Kalady',
      route: route.trim() || 'Aluva ⇄ Kalady',
      status: 'PENDING',
      submittedAt: Date.now(),
    };

    saveStudentApplication(newApp);
    setCurrentApp(newApp);
    setSubmitted(true);
    // Ensure old pass token is cleared so QR is never shown before approval
    localStorage.removeItem('vandipass_my_pass');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-md space-y-6">
        
        {/* Official Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  KSRTC COMMUTER WALLET
                </span>
              </div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                Student Bus Concession Pass
              </h1>
              <p className="text-[11px] text-slate-500 font-medium">
                Official electronic pass for transit inspection
              </p>
            </div>
            
            <div>
              {isIssued ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-[10px] font-mono font-bold shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  ACTIVE PASS
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-[10px] font-mono font-bold shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  PENDING REVIEW
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-200/80 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            onClick={() => setTab('pass')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              tab === 'pass' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Digital Pass Card
          </button>
          <button
            onClick={() => setTab('apply')}
            className={`flex-1 py-2 rounded-lg transition-all ${
              tab === 'apply' 
                ? 'bg-white text-slate-900 shadow-sm' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            New Application
          </button>
        </div>

        {/* Tab 1: Live Digital Card OR Pending Screen */}
        {tab === 'pass' && (
          isIssued ? (
            /* ISSUED STATE: Official Digital Pass Card */
            <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden space-y-0">
              {/* Card Official Top Strip */}
              <div className="bg-emerald-800 text-emerald-100 px-5 py-3 flex items-center justify-between border-b border-emerald-900">
                <div>
                  <div className="text-[9px] font-mono font-bold tracking-widest text-emerald-300 uppercase">
                    GOVERNMENT OF KERALA · MVD
                  </div>
                  <div className="text-xs font-black tracking-wide text-white uppercase">
                    KSRTC Student Concession Card
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-emerald-700/80 text-white font-mono text-[10px] font-bold border border-emerald-600">
                  2026-27
                </span>
              </div>

              <div className="p-5 space-y-4">
                {/* Passenger Info Bar */}
                <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                      STUDENT NAME
                    </span>
                    <h2 className="text-xl font-black text-slate-900">{currentApp.studentName}</h2>
                    <p className="text-xs font-bold text-emerald-800 font-mono mt-0.5">{currentApp.route}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                      PASS ID
                    </span>
                    <span className="font-mono font-black text-sm text-slate-900">
                      {currentApp.passId || 'KL-26-4874'}
                    </span>
                  </div>
                </div>

                {/* QR Card with Real Cryptographic Token */}
                <div className="flex flex-col items-center p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <QRCodeSVG 
                    value={token} 
                    size={185} 
                    level="M" 
                  />
                  <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-emerald-800 pt-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <span>ECDSA P-256 Digitally Signed by Depot 042</span>
                  </div>
                </div>

                {/* Pass Metadata Grid */}
                <div className="grid grid-cols-2 gap-3 text-xs font-mono border-t border-slate-100 pt-3">
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 text-[10px] block font-semibold">STUDENT ID</span>
                    <span className="text-slate-900 font-bold block truncate">{payload?.sid || 'ASIET-2024-8842'}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 text-[10px] block font-semibold">ROUTE CORRIDOR</span>
                    <span className="text-slate-900 font-bold block truncate">{payload?.rid || 'RT-ALV-KLD-042'}</span>
                  </div>
                  <div className="col-span-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 text-[10px] block font-semibold">INSTITUTION</span>
                    <span className="text-slate-900 font-bold block truncate">{currentApp.college}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-400 text-[10px] block font-semibold">VALID FROM</span>
                    <span className="text-slate-700 font-bold block">{validFromStr}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                    <span className="text-emerald-700 text-[10px] block font-semibold">VALID UNTIL</span>
                    <span className="text-emerald-900 font-bold block">{validUntilStr}</span>
                  </div>
                </div>

                {/* Inspection Security Strip */}
                <div className="text-center text-[11px] font-mono font-bold text-slate-600 bg-slate-100 py-2 rounded-xl border border-slate-200">
                  Air-Gapped Offline Inspection Ready · Zero Network Required
                </div>

                {/* Security Explanation Accordion */}
                <div className="border border-slate-200 rounded-xl p-3 bg-slate-50 space-y-2">
                  <button 
                    type="button"
                    onClick={() => setShowSecurityProof(!showSecurityProof)}
                    className="w-full flex items-center justify-between text-left text-xs font-bold text-slate-700 hover:text-slate-900"
                  >
                    <span>Security &amp; Cryptographic Architecture</span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {showSecurityProof ? 'Hide ▲' : 'View Proof ▼'}
                    </span>
                  </button>

                  {showSecurityProof && (
                    <div className="pt-2 text-[11px] space-y-2 text-slate-600 border-t border-slate-200">
                      <p>
                        <strong className="text-slate-800">Tamper-Proof Asymmetric Cryptography:</strong> This QR encodes a high-entropy asymmetric <strong className="text-slate-800">ECDSA P-256 digital signature</strong> produced exclusively by the Depot:
                      </p>
                      <div className="bg-slate-900 text-slate-200 font-mono text-[10px] p-2.5 rounded-xl overflow-x-auto space-y-1">
                        <div><span className="text-emerald-400">Algorithm:</span> ECDSA P-256 (SHA-256)</div>
                        <div><span className="text-blue-400">Signed Fields:</span> PASS_ID, STUDENT_ID, ROUTE_ID, VALID_FROM, VALID_UNTIL</div>
                        <div className="truncate"><span className="text-amber-400">Signature:</span> {signaturePart.slice(0, 32)}...</div>
                      </div>
                      <p className="text-[10px] text-slate-500">
                        Conductor offline scanner validates this cryptographic signature in <strong className="text-slate-700">&lt; 2ms</strong> with zero internet access.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* PENDING STATE: Official Application Tracking Card */
            <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-5 text-center">
              <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-300 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
                <svg className="w-7 h-7 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-xs font-bold text-amber-900 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  APPLICATION UNDER DEPOT VERIFICATION
                </div>
                <h2 className="text-xl font-black text-slate-900 pt-1">Concession Under Review</h2>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Your concession request has been received by Aluva Depot (042). Digital pass will activate immediately upon verification.
                </p>
              </div>

              {/* Application Details Card */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-left space-y-2.5 font-mono text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Application ID</span>
                  <span className="font-bold text-slate-900">{currentApp?.id || 'APP-001'}</span>
                </div>
                <div className="h-px bg-slate-200/60" />
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Student Name</span>
                  <span className="font-bold text-slate-900">{currentApp?.studentName || name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Institution</span>
                  <span className="font-bold text-slate-700 truncate max-w-[180px]">{currentApp?.college || institution}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 text-[10px] uppercase font-semibold">Route</span>
                  <span className="font-bold text-emerald-700">{currentApp?.route || route}</span>
                </div>
              </div>

              <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl text-center text-[11px] font-mono font-medium text-amber-800">
                Aluva Depot (042) is verifying your application details. Once approved, your Digital Pass and QR code will appear here.
              </div>

              <a
                href="/depot"
                target="_blank"
                className="inline-flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md"
              >
                <span>Open Depot to Approve &amp; Issue →</span>
              </a>
            </div>
          )
        )}

        {/* Tab 2: Enrolment Form & Official Submission Receipt */}
        {tab === 'apply' && (
          <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                FORM KSRTC-CONC-01
              </span>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                New Concession Pass Application
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Eligible for regular students enrolled in recognized educational institutions.
              </p>
            </div>
            
            {submitted ? (
              <div className="space-y-4">
                <div className="p-6 rounded-2xl bg-white border border-emerald-200 shadow-sm text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 flex items-center justify-center mx-auto text-lg font-black">
                    ✓
                  </div>

                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-xs font-bold text-emerald-900 uppercase tracking-wider">
                      APPLICATION REGISTERED
                    </span>
                    <h3 className="text-base font-black text-slate-900 pt-1">
                      Concession Request Submitted
                    </h3>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Your application has been registered into the KSRTC shared registry and forwarded to Aluva Depot (042).
                    </p>
                  </div>

                  {/* Official Acknowledgement Card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2.5 font-mono text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[10px] uppercase font-semibold">Acknowledgement ID</span>
                      <span className="font-bold text-slate-900">{currentApp?.id || 'APP-001'}</span>
                    </div>
                    <div className="h-px bg-slate-200" />
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[10px] uppercase font-semibold">Applicant</span>
                      <span className="font-bold text-slate-800">{name}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[10px] uppercase font-semibold">Assigned Depot</span>
                      <span className="font-bold text-emerald-800">Aluva (042)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[10px] uppercase font-semibold">Verification Stage</span>
                      <span className="inline-flex items-center gap-1 text-amber-700 font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Pending Depot Review
                      </span>
                    </div>
                  </div>

                  {/* Primary & Secondary Action Buttons */}
                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowStatusModal(true)}
                      className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-all shadow-sm border border-emerald-800"
                    >
                      Track Application Status
                    </button>

                    <button
                      type="button"
                      onClick={() => { setSubmitted(false); setTab('pass'); }}
                      className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                    >
                      Go to Pass Wallet
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <form 
                onSubmit={handleFormSubmit} 
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Full Legal Student Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tony Davis"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    College / School Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={institution}
                    onChange={(e) => setInstitution(e.target.value)}
                    placeholder="e.g. ASIET Kalady"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    Approved Travel Corridor (Origin ⇄ Destination) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={route}
                    onChange={(e) => setRoute(e.target.value)}
                    placeholder="e.g. Aluva ⇄ Kalady"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    College ID Card / Enrolment Certificate <span className="text-rose-500">*</span>
                  </label>
                  <input
                    id="id-card-upload"
                    type="file"
                    accept="image/jpeg,image/png,application/pdf"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      if (file && file.size > 5 * 1024 * 1024) {
                        setIdCardError('File size must be under 5 MB.');
                        setIdCard(null);
                      } else {
                        setIdCardError('');
                        setIdCard(file);
                      }
                    }}
                  />
                  <div className={`w-full rounded-xl border-2 border-dashed transition-colors px-4 py-5 ${
                    idCard
                      ? 'border-emerald-500 bg-emerald-50/60'
                      : 'border-slate-300 bg-slate-50 hover:border-slate-400'
                  }`}>
                    {idCard ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="flex items-center gap-2 text-emerald-800">
                          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="font-bold truncate max-w-[200px] text-sm">{idCard.name}</span>
                        </div>
                        <label
                          htmlFor="id-card-upload"
                          className="text-[10px] font-bold text-emerald-700 underline underline-offset-2 cursor-pointer hover:text-emerald-900 transition-colors"
                        >
                          Replace File
                        </label>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-center">
                        <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center">
                          <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                        </div>
                        <p className="text-xs font-bold text-slate-800">Upload College ID / Enrolment Proof</p>
                        <p className="text-[11px] text-slate-500 font-medium">PDF, JPG or PNG (Max 5 MB)</p>
                        <label
                          htmlFor="id-card-upload"
                          className="cursor-pointer px-4 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-700 text-xs font-bold hover:border-slate-400 hover:text-slate-900 transition-colors shadow-sm"
                        >
                          Browse Files
                        </label>
                      </div>
                    )}
                  </div>
                  {idCardError && (
                    <p className="mt-1 text-red-600 text-[11px] font-semibold">{idCardError}</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all shadow-sm border border-emerald-800 text-xs"
                  >
                    Submit Concession Application
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Application Status Detail Modal */}
        {showStatusModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase">DEPOT TRACKING</span>
                  <h3 className="text-base font-black text-slate-900">Application Status</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              {/* Progress Stepper */}
              <div className="space-y-3 py-1">
                <div className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">✓</span>
                  <div>
                    <div className="text-xs font-bold text-slate-900">Application Submitted</div>
                    <div className="text-[10px] font-mono text-slate-400">ID: {currentApp?.id || 'APP-001'} · {currentApp?.studentName || name}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                    isIssued ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700 animate-pulse'
                  }`}>
                    {isIssued ? '✓' : '●'}
                  </span>
                  <div>
                    <div className={`text-xs font-bold ${isIssued ? 'text-slate-900' : 'text-amber-700'}`}>
                      Depot Review (Aluva 042)
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {isIssued ? 'Verified student details, institution, route & proof' : 'Verifying student enrolment & institution proof'}
                    </div>
                  </div>
                </div>

                <div className={`flex items-start gap-3 ${isIssued ? '' : 'opacity-40'}`}>
                  <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                    isIssued ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isIssued ? '✓' : '○'}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-700">ECDSA Cryptographic Signing</div>
                    <div className="text-[10px] text-slate-400">
                      {isIssued ? 'Asymmetric keypair signature generated' : 'Waiting for depot signature'}
                    </div>
                  </div>
                </div>

                <div className={`flex items-start gap-3 ${isIssued ? '' : 'opacity-40'}`}>
                  <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 ${
                    isIssued ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isIssued ? '✓' : '○'}
                  </span>
                  <div>
                    <div className="text-xs font-bold text-slate-700">Digital Pass Ready</div>
                    <div className="text-[10px] text-slate-400">
                      {isIssued ? 'QR activated for offline bus scanning' : 'Will activate automatically upon depot approval'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                {isIssued ? (
                  <button
                    type="button"
                    onClick={() => { setShowStatusModal(false); setTab('pass'); }}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-center text-xs font-bold transition-all shadow-md shadow-emerald-600/25"
                  >
                    Open My Digital Pass + QR →
                  </button>
                ) : (
                  <a
                    href="/depot"
                    target="_blank"
                    className="block w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-center text-xs font-bold transition-all"
                  >
                    Open Depot to Approve →
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setShowStatusModal(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

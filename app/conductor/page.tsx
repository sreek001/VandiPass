'use client';

import React, { useState } from 'react';
import ScannerView from '@/components/ScannerView';
import { validatePassId } from '@/lib/validator';
import { Zap, CheckCircle2, XCircle } from 'lucide-react';

export default function ConductorPage() {
  const [result, setResult] = useState<any | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [scannedCount, setScannedCount] = useState(0);

  const handleScan = (decodedText: string) => {
    setIsScanning(false);
    setScannedCount((prev) => prev + 1);

    // Instant GPay Audio Chime
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    } catch {}

    let passId = 'KL-26-4874';
    let name = 'Tony Davis';
    let institution = 'ASIET Kalady';
    let route = 'Aluva ⇄ Kalady';

    if (decodedText.startsWith('VANDIPASS:')) {
      const parts = decodedText.split(':');
      passId = parts[1] || passId;
      name = parts[2] || name;
      institution = parts[3] || institution;
      route = parts[4] || route;
    }

    const isValidId = validatePassId(passId);

    setResult({
      valid: isValidId,
      name,
      passId,
      institution,
      route,
      expires: '31 March 2027',
    });

    setTimeout(() => {
      setResult(null);
      setIsScanning(true);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-4 flex flex-col items-center justify-between max-w-md mx-auto">
      
      {/* Header */}
      <header className="w-full flex justify-between items-center py-3 border-b border-slate-200">
        <div>
          <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase tracking-wider">
            CONDUCTOR TERMINAL
          </span>
          <h1 className="text-xl font-black text-slate-900">Scan Pass</h1>
        </div>
        <div className="px-3 py-1 rounded-xl bg-white border border-slate-200 text-xs font-mono shadow-sm">
          <span className="text-slate-400">Scanned: </span>
          <span className="font-bold text-emerald-700">{scannedCount}</span>
        </div>
      </header>

      {/* Optical Viewfinder */}
      <main className="relative w-full my-auto flex flex-col items-center">
        <ScannerView onScan={handleScan} active={isScanning} />

        {/* Immediate Result Card */}
        {result && (
          <div
            className={`absolute inset-0 rounded-3xl p-6 flex flex-col justify-between shadow-2xl transition-all duration-150 animate-in fade-in zoom-in-95 ${
              result.valid ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}
          >
            <div className="flex justify-between items-start border-b border-white/20 pb-3">
              <div className="space-y-0.5">
                <span className="text-xs font-bold uppercase tracking-wider opacity-85">
                  {result.valid ? 'PASS APPROVED' : 'INVALID CONCESSION'}
                </span>
                <h2 className="text-2xl font-black">{result.name}</h2>
              </div>
              <div className="p-1 rounded-xl bg-white/20">
                {result.valid ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              </div>
            </div>

            <div className="space-y-2 py-3 text-xs font-mono">
              <div className="flex justify-between">
                <span className="opacity-75">Pass ID:</span>
                <span className="font-bold">{result.passId}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-75">Route:</span>
                <span className="font-bold">{result.route}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-75">Institution:</span>
                <span className="font-bold">{result.institution}</span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-75">Expiry:</span>
                <span className="font-bold">{result.expires}</span>
              </div>
            </div>

            <div className="text-center text-[10px] opacity-75 font-mono">
              Auto-resetting for next commuter...
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={() => handleScan('VANDIPASS:KL-26-4874:Tony Davis:ASIET Kalady:Aluva ⇄ Kalady')}
          className="mt-4 text-xs font-bold text-slate-600 hover:text-emerald-700 bg-white border border-slate-200 px-4 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
        >
          <Zap className="w-3.5 h-3.5 text-emerald-600" />
          <span>Direct Pass Verification</span>
        </button>
      </main>

      <footer className="text-center text-xs text-slate-400 py-3 font-mono">
        Hold pass QR steadily inside the viewfinder
      </footer>

    </div>
  );
}

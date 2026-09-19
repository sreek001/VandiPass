'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { translations } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';
import { verifyPassLocally, type VerificationVerdict } from '@/lib/crypto';
import ScannerView from '@/components/ScannerView';
import VerdictOverlay from '@/components/VerdictOverlay';
import SettingsDrawer from '@/components/SettingsDrawer';

type VerdictState = 'IDLE' | 'VALID' | 'INVALID' | 'WRONG_ROUTE';

/** Play a tone using Web Audio API */
function playTone(freq: number, duration: number, type: OscillatorType = 'sine') {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch { /* audio not available */ }
}

function playChime() {
  playTone(880, 0.15);
  setTimeout(() => playTone(1108, 0.25), 120);
}

function playBuzz() {
  playTone(180, 0.4, 'sawtooth');
}

function vibrateDevice(pattern: number[]) {
  try { navigator.vibrate?.(pattern); } catch { /* */ }
}

export default function ConductorPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>('en');
  const [verdict, setVerdict] = useState<VerdictState>('IDLE');
  const [verdictData, setVerdictData] = useState<VerificationVerdict | null>(null);
  const [verificationMs, setVerificationMs] = useState(0);
  const [tripCount, setTripCount] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [showSettings, setShowSettings] = useState(false);
  const [sound, setSound] = useState(true);
  const [vibration, setVibration] = useState(true);
  const [brightness, setBrightness] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const isScanningRef = useRef(true);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const t = translations[lang];

  // Brightness boost
  useEffect(() => {
    if (brightness) {
      document.body.style.filter = 'brightness(1.3)';
    } else {
      document.body.style.filter = '';
    }
    return () => { document.body.style.filter = ''; };
  }, [brightness]);

  const resetToScanner = useCallback(() => {
    setVerdict('IDLE');
    setVerdictData(null);
    setCountdown(3);
    isScanningRef.current = true;
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, []);

  const startCountdown = useCallback(() => {
    setCountdown(3);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current!);
          resetToScanner();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [resetToScanner]);

  const onDetect = useCallback(async (rawValue: string) => {
    if (!isScanningRef.current) return;
    isScanningRef.current = false;

    const t0 = performance.now();
    const outcome = await verifyPassLocally(rawValue);
    const elapsed = performance.now() - t0;
    setVerificationMs(elapsed);

    setVerdictData(outcome);

    if (outcome.valid) {
      setVerdict('VALID');
      setTripCount(c => c + 1);
      if (sound) playChime();
      if (vibration) vibrateDevice([50, 30, 100]);
    } else if (outcome.reason === 'WRONG_ROUTE') {
      setVerdict('WRONG_ROUTE');
      if (sound) playTone(440, 0.5);
      if (vibration) vibrateDevice([100, 50, 100]);
    } else {
      setVerdict('INVALID');
      if (sound) playBuzz();
      if (vibration) vibrateDevice([200, 100, 200]);
    }

    startCountdown();
  }, [sound, vibration, startCountdown]);

  useEffect(() => {
    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 antialiased p-4 sm:p-6 flex flex-col items-center" style={{ userSelect: 'none' }}>
      <div className="w-full max-w-md space-y-5">
        {/* Official Transit ETM Header */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider">
                  KSRTC ETM TERMINAL #042
                </span>
              </div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">
                Concession Validator
              </h1>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-bold text-emerald-800 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                {verdict === 'IDLE' ? 'AIR-GAPPED ENGINE READY' : 'PROCESSING ATTESTATION…'}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs font-mono font-bold text-center shadow-sm">
                <div className="text-[9px] text-slate-400 uppercase">Boarded</div>
                <div className="text-sm font-black text-emerald-700">{tripCount}</div>
              </div>

              <button
                id="conductor-settings-btn"
                className="w-9 h-9 rounded-xl bg-slate-50 border border-slate-200 shadow-sm flex items-center justify-center hover:bg-slate-100 text-slate-700 transition-colors"
                onClick={() => setShowSettings(true)}
                aria-label="Settings"
              >
                <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 pt-0.5">
            <span>Stage Route: <strong className="text-slate-800">Aluva ⇄ Kalady</strong></span>
            <span className="text-emerald-700 font-bold">Offline Active</span>
          </div>
        </div>

        {/* Scanner Card */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-4">
          <div style={{ position: 'relative', width: '100%', maxWidth: 320 }}>
            <ScannerView
              ref={videoRef}
              onDetect={onDetect}
              active={verdict === 'IDLE'}
            />

            {/* Verdict overlays */}
            {verdict !== 'IDLE' && (
              <VerdictOverlay
                verdict={verdict === 'WRONG_ROUTE' ? 'WRONG_ROUTE' : verdict}
                data={verdictData}
                lang={lang}
                countdown={countdown}
                verificationMs={verificationMs}
                onReset={resetToScanner}
              />
            )}
          </div>

          <p className="text-xs text-slate-500 text-center font-medium">
            {verdict === 'IDLE' ? t.scanPrompt : ''}
          </p>

          {/* Test or Scan Image file fallback for desktop testing */}
          {verdict === 'IDLE' && (
            <div className="flex items-center gap-2 pt-1">
              <label className="cursor-pointer px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold transition-all border border-slate-200 flex items-center gap-1.5 shadow-sm">
                <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span>Scan QR Image / File</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = async () => {
                      const img = new Image();
                      img.onload = async () => {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.width;
                        canvas.height = img.height;
                        const ctx = canvas.getContext('2d');
                        if (!ctx) return;
                        ctx.drawImage(img, 0, 0);
                        const imgData = ctx.getImageData(0, 0, img.width, img.height);
                        const jsQRModule = await import('jsqr');
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const jsQR = (jsQRModule as any).default || jsQRModule;
                        const code = jsQR(imgData.data, img.width, img.height);
                        if (code?.data) {
                          onDetect(code.data);
                        } else {
                          onDetect('INVALID_TAMPERED_PAYLOAD');
                        }
                      };
                      img.src = reader.result as string;
                    };
                    reader.readAsDataURL(file);
                  }}
                />
              </label>

              <button
                type="button"
                onClick={() => onDetect('TAMPERED_FAKE_QR_SIGNATURE_INVALID')}
                className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-[11px] font-bold transition-all border border-red-200 shadow-sm"
              >
                Test Fake QR
              </button>
            </div>
          )}

          {/* Manual reset button (visible when result is showing) */}
          {verdict !== 'IDLE' && (
            <button
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/25"
              onClick={resetToScanner}
            >
              {lang === 'ml' ? 'സ്കാനറിലേക്ക് മടങ്ങുക' : 'Back to Scanner'}
            </button>
          )}
        </div>

        <footer className="pt-4 border-t border-slate-200 text-center text-xs text-slate-500 font-mono">
          Kerala State Road Transport Corporation · VandiPass
        </footer>
      </div>

      {showSettings && (
        <SettingsDrawer
          lang={lang}
          onLangChange={setLang}
          soundEnabled={sound}
          onSoundChange={setSound}
          vibrationEnabled={vibration}
          onVibrationChange={setVibration}
          brightnessEnabled={brightness}
          onBrightnessChange={setBrightness}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  );
}

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
  const [lang, setLang] = useState<Lang>('ml');
  const [verdict, setVerdict] = useState<VerdictState>('IDLE');
  const [verdictData, setVerdictData] = useState<VerificationVerdict | null>(null);
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

    const outcome = await verifyPassLocally(rawValue);

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
    <div className="min-h-screen bg-[#f8fafc] text-slate-800" style={{ userSelect: 'none' }}>
      <div className="max-w-md mx-auto px-4 py-8 space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <span className="text-xs text-slate-500 font-semibold uppercase">Real-Time Verification</span>
            <h1 className="text-2xl font-black text-slate-900">{t.conductorScan}</h1>
            <p className="text-xs font-semibold text-emerald-700">
              {verdict === 'IDLE' ? `● ${t.ready}` : '⏸ Processing…'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold text-center">
              <div>{tripCount} {t.tripCount}</div>
            </div>

            <button
              id="conductor-settings-btn"
              className="w-8 h-8 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-sm hover:bg-slate-50 transition-colors"
              onClick={() => setShowSettings(true)}
            >
              ⚙️
            </button>
          </div>
        </div>

        {/* Scanner Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col items-center justify-center space-y-4">
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
              />
            )}
          </div>

          <p className="text-xs text-slate-500 text-center">
            {verdict === 'IDLE' ? t.scanPrompt : ''}
          </p>

          {/* Manual reset button (visible when result is showing) */}
          {verdict !== 'IDLE' && (
            <button
              className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-black transition-all"
              onClick={resetToScanner}
            >
              ↩ {lang === 'ml' ? 'സ്കാനറിലേക്ക് മടങ്ങുക' : 'Back to Scanner'}
            </button>
          )}
        </div>

        <footer className="pt-4 border-t border-slate-200 text-center text-xs text-slate-400">
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

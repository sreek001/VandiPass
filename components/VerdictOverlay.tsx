'use client';

import React, { useRef, useEffect } from 'react';
import { VerificationVerdict } from '@/lib/crypto';
import { render4BitBitmapToCanvas } from '@/lib/bitmap';
import { translations } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';

interface VerdictOverlayProps {
  verdict: 'VALID' | 'INVALID' | 'WRONG_ROUTE';
  data: VerificationVerdict | null;
  lang: Lang;
  countdown: number;
  verificationMs: number;
  onReset: () => void;
}

function formatReason(reason: string | undefined): string {
  switch (reason) {
    case 'INVALID_SIGNATURE': return 'Digital signature verification failed';
    case 'EXPIRED':           return 'Pass has expired';
    case 'WRONG_ROUTE':       return 'Route mismatch for this bus';
    case 'MALFORMED':         return 'Digital signature verification failed';
    default:                  return 'Digital signature verification failed';
  }
}

export default function VerdictOverlay({ verdict, data, lang, countdown, verificationMs, onReset }: VerdictOverlayProps) {
  const t = translations[lang];
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeSec = (verificationMs / 1000).toFixed(2);

  useEffect(() => {
    if (data?.payload?.img && canvasRef.current) {
      render4BitBitmapToCanvas(data.payload.img, canvasRef.current);
    }
  }, [data]);

  const isValid = verdict === 'VALID';
  const isWrong = verdict === 'WRONG_ROUTE';

  const className = isValid
    ? 'verdict-overlay verdict-valid'
    : isWrong
    ? 'verdict-overlay verdict-wrong'
    : 'verdict-overlay verdict-invalid';

  const payload = data?.payload;

  const CountdownRing = (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:8,fontSize:12,opacity:0.75 }}>
      <svg width="16" height="16" viewBox="0 0 16 16" style={{ flexShrink:0 }}>
        <circle cx="8" cy="8" r="7" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
        <circle cx="8" cy="8" r="7" fill="none" stroke="white" strokeWidth="1.5"
          strokeDasharray={`${(countdown / 3) * 44} 44`}
          strokeLinecap="round" transform="rotate(-90 8 8)"
          style={{ transition:'stroke-dasharray 1s linear' }} />
      </svg>
      {t.autoReset} ({countdown}s)
    </div>
  );

  if (isValid) {
    return (
      <div className={className}>
        {/* ── Official Transit Verdict Header ── */}
        <div style={{ display:'flex', alignItems:'center', gap:12, borderBottom:'1px solid rgba(255,255,255,0.2)', paddingBottom:10 }}>
          <span style={{ width:40, height:40, borderRadius:'50%', background:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:900, flexShrink:0 }}>
            ✓
          </span>
          <div>
            <div style={{ fontSize:10, fontWeight:800, letterSpacing:'0.14em', textTransform:'uppercase', opacity:0.85 }}>
              KSRTC TRANSIT INSPECTION · VALID
            </div>
            <div style={{ fontSize:18, fontWeight:900, letterSpacing:'-0.01em' }}>
              ✓ PASS VERIFIED &amp; ADMITTED
            </div>
          </div>
        </div>

        {/* ── Passenger Credentials Block ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:8, margin:'auto 0' }}>
          <div style={{ background:'rgba(255,255,255,0.16)', borderRadius:14, padding:'12px 14px' }}>
            <div style={{ fontSize:10, fontWeight:800, textTransform:'uppercase', letterSpacing:'0.08em', opacity:0.75 }}>
              PASSENGER
            </div>
            <div style={{ fontSize:20, fontWeight:900, letterSpacing:'-0.01em', lineHeight:1.2, marginTop:2 }}>
              {payload?.nam ?? '—'}
            </div>
            <div style={{ fontSize:13, fontWeight:700, opacity:0.95, marginTop:4 }}>
              {payload?.ins ?? '—'}
            </div>
            <div style={{ fontSize:13, fontWeight:800, color:'#fef08a', marginTop:2 }}>
              Route: {payload?.rou ?? '—'}
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:8, paddingTop:6, borderTop:'1px solid rgba(255,255,255,0.18)' }}>
              <span style={{ fontSize:10, fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase', opacity:0.8 }}>
                PASS SERIAL
              </span>
              <span style={{ fontSize:12, fontFamily:'monospace', fontWeight:900 }}>
                {payload?.pid ?? '—'}
              </span>
            </div>
          </div>
        </div>

        {/* ── Official Attestation Badges & Actions ── */}
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, background:'rgba(0,0,0,0.24)', borderRadius:10, padding:'6px 12px', fontSize:11, fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase' }}>
            ● OFFLINE CRYPTOGRAPHICALLY VERIFIED
          </div>

          {verificationMs > 0 && (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', background:'rgba(0,0,0,0.2)', borderRadius:10, padding:'6px 12px', fontSize:11, fontFamily:'monospace' }}>
              <span style={{ opacity:0.8 }}>Attestation latency</span>
              <span style={{ fontWeight:800 }}>Verified in {timeSec} sec</span>
            </div>
          )}

          {/* Primary Action Button */}
          <button
            onClick={onReset}
            style={{
              background: '#ffffff',
              color: '#065f46',
              border: 'none',
              borderRadius: 12,
              padding: '10px 14px',
              fontSize: 12,
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
              marginTop: 2,
            }}
          >
            Scan Next Passenger
          </button>

          {CountdownRing}
        </div>
      </div>
    );
  }

  const reasonText = isWrong
    ? (payload ? `Pass is for ${data?.payload?.rou}. Student is on the wrong bus.` : 'Route mismatch for this bus service.')
    : formatReason(data?.reason);

  return (
    <div className={className}>
      {/* ── Official Transit Rejection Header ── */}
      <div style={{ display:'flex', alignItems:'center', gap:12, borderBottom:'1px solid rgba(255,255,255,0.2)', paddingBottom:10 }}>
        <span style={{ width:40, height:40, borderRadius:'50%', background:'rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:22, fontWeight:900, flexShrink:0 }}>
          ✕
        </span>
        <div>
          <div style={{ fontSize:10, fontWeight:800, letterSpacing:'0.14em', textTransform:'uppercase', opacity:0.85 }}>
            SECURITY EXCEPTION · ENTRY DENIED
          </div>
          <div style={{ fontSize:18, fontWeight:900, letterSpacing:'-0.01em' }}>
            ✕ INVALID CONCESSION PASS
          </div>
        </div>
      </div>

      <div style={{ margin:'auto 0', background:'rgba(0,0,0,0.28)', borderRadius:14, padding:'14px 16px', display:'flex', flexDirection:'column', gap:6 }}>
        <div style={{ fontSize:10, fontWeight:800, letterSpacing:'0.1em', textTransform:'uppercase', opacity:0.75 }}>
          Security Audit Notice
        </div>
        <div style={{ fontSize:15, fontWeight:800, lineHeight:1.3 }}>
          {reasonText}
        </div>
        <div style={{ fontSize:11, opacity:0.85, lineHeight:1.3 }}>
          Digital signature does not match KSRTC trusted depot verification keys.
        </div>
        {payload && !isWrong && (
          <div style={{ fontSize:11, opacity:0.85, fontFamily:'monospace', marginTop:4 }}>
            Pass ID: {payload.pid}
          </div>
        )}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:6, background:'rgba(0,0,0,0.24)', borderRadius:10, padding:'6px 12px', fontSize:11, fontWeight:800, letterSpacing:'0.08em', textTransform:'uppercase' }}>
          OFFLINE ATTESTATION FAILED
        </div>

        {/* Primary Action Button */}
        <button
          onClick={onReset}
          style={{
            background: '#ffffff',
            color: '#991b1b',
            border: 'none',
            borderRadius: 12,
            padding: '10px 16px',
            fontSize: 13,
            fontWeight: 900,
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          Try Again / Scan Next
        </button>

        {CountdownRing}
      </div>
    </div>
  );
}
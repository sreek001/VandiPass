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
}

export default function VerdictOverlay({ verdict, data, lang, countdown }: VerdictOverlayProps) {
  const t = translations[lang];
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (data?.payload?.img && canvasRef.current) {
      render4BitBitmapToCanvas(data.payload.img, canvasRef.current);
    }
  }, [data]);

  const isValid   = verdict === 'VALID';
  const isWrong   = verdict === 'WRONG_ROUTE';

  const className = isValid
    ? 'verdict-overlay verdict-valid'
    : isWrong
    ? 'verdict-overlay verdict-wrong'
    : 'verdict-overlay verdict-invalid';

  const label = isValid ? t.admit : isWrong ? t.wrongRoute : t.invalid;
  const icon  = isValid ? '✓' : isWrong ? '⚠' : '✕';

  const payload = data?.payload;

  return (
    <div className={className}>
      {/* Label */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            fontWeight: 900,
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
        <div>
          <div className="verdict-label">{label}</div>
          {payload && <div className="verdict-name">{payload.nam}</div>}
          {!payload && (
            <div className="verdict-name" style={{ fontSize: 22 }}>
              {isWrong ? 'Route Check Failed' : 'Verification Failed'}
            </div>
          )}
        </div>
      </div>

      {/* Passenger info */}
      {payload && (
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', margin: 'auto 0' }}>
          {/* Photo */}
          <div className="verdict-photo-wrap">
            {payload.img ? (
              <canvas ref={canvasRef} />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 32,
                }}
              >
                👤
              </div>
            )}
          </div>

          {/* Details */}
          <div className="verdict-details">
            <div className="verdict-detail-row">
              <span>{t.route}:</span> {payload.rou}
            </div>
            <div className="verdict-detail-row">
              <span>{t.institution}:</span> {payload.ins}
            </div>
            <div className="verdict-detail-row">
              <span>{t.expires}:</span>{' '}
              {new Date(payload.exp * 1000).toLocaleDateString('en-IN')}
            </div>
            <div className="verdict-detail-row">
              <span>{t.passId}:</span>{' '}
              <span style={{ fontFamily: 'monospace', fontSize: 11 }}>{payload.pid}</span>
            </div>
          </div>
        </div>
      )}

      {!payload && isWrong && data?.payload && (
        <div style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.5, margin: 'auto 0' }}>
          Pass is for <strong>{data.payload.rou}</strong>.
          <br />
          Student is on the wrong bus.
        </div>
      )}

      {!payload && !isWrong && (
        <div style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.5, margin: 'auto 0' }}>
          This pass could not be verified.
          <br />
          It may be altered, copied, or expired.
        </div>
      )}

      {/* Auto-reset countdown */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          fontSize: 12,
          opacity: 0.7,
        }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
          <circle cx="8" cy="8" r="7" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
          <circle
            cx="8"
            cy="8"
            r="7"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeDasharray={`${(countdown / 3) * 44} 44`}
            strokeLinecap="round"
            transform="rotate(-90 8 8)"
            style={{ transition: 'stroke-dasharray 1s linear' }}
          />
        </svg>
        {t.autoReset}
      </div>
    </div>
  );
}

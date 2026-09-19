'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { PassPayload } from '@/lib/crypto';
import { translations } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';

interface PassCardProps {
  token: string;
  payload: PassPayload;
  lang: Lang;
}

export default function PassCard({ token, payload, lang }: PassCardProps) {
  const t = translations[lang];

  const expiryDate = new Date(payload.exp * 1000).toLocaleDateString(
    lang === 'ml' ? 'ml-IN' : 'en-IN',
    { day: 'numeric', month: 'short', year: 'numeric' }
  );

  const isExpired = payload.exp < Math.floor(Date.now() / 1000);

  return (
    <div className="pass-card fade-up">
      {/* Holographic shimmer layer */}
      <div className="pass-card-shimmer" />

      {/* Header */}
      <div className="pass-card-header">
        <div>
          <div className="pass-card-issuer">🚌 KSRTC Concession Pass</div>
          <div className="pass-card-name">{payload.nam}</div>
          <div className="pass-card-route">📍 {payload.rou}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
          <span className="text-xs font-mono text-slate-400">{payload.pid || 'KL-26-4874'}</span>
        </div>
      </div>

      {/* QR Code */}
      <div className="pass-qr-wrapper">
        <QRCodeSVG
          value={`VANDIPASS:${payload.pid || 'KL-26-4874'}:${payload.nam || 'Tony Davis'}:${payload.ins || 'ASIET Kalady'}:${payload.rou || 'Aluva ⇄ Kalady'}`}
          size={220}
          level="L"
          includeMargin={true}
          fgColor="#0f172a"
          bgColor="#ffffff"
          style={{ borderRadius: 8 }}
        />
      </div>

      {/* Details */}
      <div className="pass-details-grid">
        <div className="pass-detail-item">
          <div className="pass-detail-label">{t.passId}</div>
          <div className="pass-detail-value" style={{ fontFamily: 'monospace', fontSize: 12 }}>
            {payload.pid}
          </div>
        </div>
        <div className="pass-detail-item">
          <div className="pass-detail-label">{t.expires}</div>
          <div
            className="pass-detail-value"
            style={{ color: isExpired ? '#dc2626' : '#065f46' }}
          >
            {expiryDate}
          </div>
        </div>
        <div className="pass-detail-item" style={{ gridColumn: '1 / -1' }}>
          <div className="pass-detail-label">{t.institution}</div>
          <div className="pass-detail-value">{payload.ins}</div>
        </div>
      </div>

      {/* Official footer line */}
      <div
        style={{
          marginTop: 16,
          paddingTop: 12,
          borderTop: '1px solid rgba(15,23,42,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <span style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Digitally Signed · Offline Verifiable
        </span>
        <span style={{ fontSize: 9, color: '#94a3b8' }}>🔐 ECDSA·P-256</span>
      </div>
    </div>
  );
}

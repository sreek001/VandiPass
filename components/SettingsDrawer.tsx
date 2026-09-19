'use client';

import React from 'react';
import { Lang, translations } from '@/lib/i18n';

interface SettingsDrawerProps {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  soundEnabled: boolean;
  onSoundChange: (v: boolean) => void;
  vibrationEnabled: boolean;
  onVibrationChange: (v: boolean) => void;
  brightnessEnabled: boolean;
  onBrightnessChange: (v: boolean) => void;
  onClose: () => void;
}

export default function SettingsDrawer({
  lang, onLangChange,
  soundEnabled, onSoundChange,
  vibrationEnabled, onVibrationChange,
  brightnessEnabled, onBrightnessChange,
  onClose,
}: SettingsDrawerProps) {
  const t = translations[lang];

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={e => e.stopPropagation()}>
        <div className="drawer-handle" />

        {/* Header */}
        <div className="drawer-header">
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>{t.settings}</h3>
            <p style={{ fontSize: 11, color: 'var(--clr-text-muted)', marginTop: 2 }}>
              ⚙️ ക്രമീകരണങ്ങൾ / Settings
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-icon"
            style={{ fontSize: 18, width: 36, height: 36 }}
          >
            ✕
          </button>
        </div>

        {/* Language */}
        <div className="drawer-section">
          <div className="drawer-section-label">{t.language} / ഭാഷ</div>
          <div className="lang-grid">
            <button
              className={`lang-btn ${lang === 'ml' ? 'active' : ''}`}
              onClick={() => onLangChange('ml')}
            >
              🇮🇳 മലയാളം
            </button>
            <button
              className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => onLangChange('en')}
            >
              🇬🇧 English
            </button>
          </div>
        </div>

        {/* Display */}
        <div className="drawer-section">
          <div className="drawer-section-label">Display / ഡിസ്പ്ലേ</div>

          <div className="toggle-row">
            <div>
              <div className="toggle-label">☀️ {t.highBrightness}</div>
              <div className="toggle-sublabel">Boost screen brightness for scanning outdoors</div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={brightnessEnabled}
                onChange={e => onBrightnessChange(e.target.checked)}
              />
              <div className="toggle-track">
                <div className="toggle-thumb" />
              </div>
            </label>
          </div>
        </div>

        {/* Feedback */}
        <div className="drawer-section">
          <div className="drawer-section-label">Feedback / അറിയിപ്പുകൾ</div>

          <div className="toggle-row">
            <div>
              <div className="toggle-label">🔊 {t.soundAlert} (ശബ്ദം)</div>
              <div className="toggle-sublabel">Chime on valid, buzzer on invalid</div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={soundEnabled}
                onChange={e => onSoundChange(e.target.checked)}
              />
              <div className="toggle-track">
                <div className="toggle-thumb" />
              </div>
            </label>
          </div>

          <div className="toggle-row">
            <div>
              <div className="toggle-label">📳 {t.vibration} (വൈബ്രേഷൻ)</div>
              <div className="toggle-sublabel">Haptic pulse on scan result</div>
            </div>
            <label className="toggle">
              <input
                type="checkbox"
                checked={vibrationEnabled}
                onChange={e => onVibrationChange(e.target.checked)}
              />
              <div className="toggle-track">
                <div className="toggle-thumb" />
              </div>
            </label>
          </div>
        </div>

        <button className="btn btn-primary btn-full" onClick={onClose}>
          ✓ {t.done}
        </button>
      </div>
    </div>
  );
}

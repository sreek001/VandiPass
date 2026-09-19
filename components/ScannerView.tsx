'use client';

import React, { useEffect, useRef, useState, useCallback, forwardRef } from 'react';

interface ScannerViewProps {
  onDetect: (rawValue: string) => void;
  active: boolean;
}

const ScannerView = forwardRef<HTMLVideoElement, ScannerViewProps>(
  ({ onDetect, active }, videoRef) => {
    const streamRef = useRef<MediaStream | null>(null);
    const animRef = useRef<number>(0);
    const isScanningRef = useRef(true);
    const [cameraError, setCameraError] = useState(false);

    useEffect(() => {
      isScanningRef.current = active;
    }, [active]);

    const initCamera = useCallback(async () => {
      setCameraError(false);

      // Clean up any existing stream & anim
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }

      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        setCameraError(true);
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' }, width: { ideal: 720 }, height: { ideal: 720 } },
        });
        streamRef.current = stream;

        const vid = (videoRef as React.RefObject<HTMLVideoElement>).current;
        if (vid) {
          vid.srcObject = stream;
          await vid.play();
        }

        let barcodeDetectorInstance: { detect: (src: HTMLVideoElement) => Promise<Array<{ rawValue: string }>> } | null = null;

        // Try BarcodeDetector first (Chrome/Android)
        if ('BarcodeDetector' in window) {
          try {
            barcodeDetectorInstance = new (window as unknown as {
              BarcodeDetector: new (opts: object) => {
                detect: (src: HTMLVideoElement) => Promise<Array<{ rawValue: string }>>;
              };
            }).BarcodeDetector({ formats: ['qr_code'] });
          } catch {
            barcodeDetectorInstance = null;
          }
        }

        if (barcodeDetectorInstance) {
          const loop = async () => {
            const currentVid = (videoRef as React.RefObject<HTMLVideoElement>).current;
            if (currentVid && isScanningRef.current && currentVid.readyState >= 2) {
              try {
                const codes = await barcodeDetectorInstance!.detect(currentVid);
                if (codes.length > 0 && isScanningRef.current) {
                  onDetect(codes[0].rawValue);
                }
              } catch {
                // ignore frame detection error
              }
            }
            animRef.current = requestAnimationFrame(loop);
          };
          animRef.current = requestAnimationFrame(loop);
        } else {
          // Fallback: jsQR canvas decode
          const jsQRModule = await import('jsqr');
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const jsQR = (jsQRModule as any).default || jsQRModule;
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d', { willReadFrequently: true })!;

          const loop = () => {
            const currentVid = (videoRef as React.RefObject<HTMLVideoElement>).current;
            if (currentVid && isScanningRef.current && currentVid.readyState >= 2) {
              const { videoWidth: w, videoHeight: h } = currentVid;
              if (w > 0 && h > 0) {
                canvas.width = w;
                canvas.height = h;
                ctx.drawImage(currentVid, 0, 0, w, h);
                const imageData = ctx.getImageData(0, 0, w, h);
                const code = jsQR(imageData.data, w, h);
                if (code && isScanningRef.current) {
                  onDetect(code.data);
                }
              }
            }
            animRef.current = requestAnimationFrame(loop);
          };
          animRef.current = requestAnimationFrame(loop);
        }
      } catch (err) {
        console.error('Camera init error:', err);
        setCameraError(true);
      }
    }, [onDetect, videoRef]);

    useEffect(() => {
      initCamera();

      return () => {
        if (animRef.current) cancelAnimationFrame(animRef.current);
        streamRef.current?.getTracks().forEach(t => t.stop());
      };
    }, [initCamera]);

    return (
      <div className="scanner-viewport" style={{ position: 'relative', overflow: 'hidden' }}>
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className="scanner-video"
        />

        {/* Camera Permission / Error Fallback UI */}
        {cameraError && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: '#0f172a',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              textAlign: 'center',
              zIndex: 30,
              borderRadius: 'inherit',
            }}
          >
            <svg
              className="w-10 h-10 text-slate-400 mb-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div style={{ fontSize: 16, fontWeight: 800, color: '#f8fafc', marginBottom: 6 }}>
              Camera access needed
            </div>
            <div style={{ fontSize: 13, color: '#94a3b8', maxWidth: 220, marginBottom: 18, lineHeight: 1.4 }}>
              Allow camera permission to scan a student pass.
            </div>
            <button
              onClick={() => initCamera()}
              style={{
                background: '#059669',
                color: '#ffffff',
                border: 'none',
                borderRadius: 12,
                padding: '10px 20px',
                fontSize: 13,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
              }}
            >
              Try Again
            </button>
          </div>
        )}

        {/* Animated scan frame */}
        {!cameraError && (
          <>
            <div className="scanner-frame">
              <div className="scanner-frame-inner" style={{ position: 'absolute', inset: 0 }} />
              {active && <div className="scanner-line" />}
            </div>

            {/* Dimming corners */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: `
                  radial-gradient(
                    ellipse 60% 60% at center,
                    transparent 50%,
                    rgba(0,0,0,0.45) 100%
                  )
                `,
                pointerEvents: 'none',
              }}
            />
          </>
        )}
      </div>
    );
  }
);

ScannerView.displayName = 'ScannerView';
export default ScannerView;

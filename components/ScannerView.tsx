'use client';

import React, { useEffect, useRef, forwardRef } from 'react';

interface ScannerViewProps {
  onDetect: (rawValue: string) => void;
  active: boolean;
}

const ScannerView = forwardRef<HTMLVideoElement, ScannerViewProps>(
  ({ onDetect, active }, videoRef) => {
    const streamRef = useRef<MediaStream | null>(null);
    const animRef = useRef<number>(0);
    const isScanningRef = useRef(true);

    useEffect(() => {
      isScanningRef.current = active;
    }, [active]);

    useEffect(() => {
      let mounted = true;

      const init = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: { ideal: 720 }, height: { ideal: 720 } },
          });
          streamRef.current = stream;

          const vid = (videoRef as React.RefObject<HTMLVideoElement>).current;
          if (vid && mounted) {
            vid.srcObject = stream;
            await vid.play();
          }

          // Try BarcodeDetector first (Chrome/Android)
          if ('BarcodeDetector' in window) {
            const detector = new (window as unknown as {
              BarcodeDetector: new (opts: object) => {
                detect: (src: HTMLVideoElement) => Promise<Array<{ rawValue: string }>>;
              };
            }).BarcodeDetector({ formats: ['qr_code'] });

            const loop = async () => {
              if (!mounted) return;
              const currentVid = (videoRef as React.RefObject<HTMLVideoElement>).current;
              if (currentVid && isScanningRef.current && currentVid.readyState >= 2) {
                try {
                  const codes = await detector.detect(currentVid);
                  if (codes.length > 0 && isScanningRef.current) {
                    onDetect(codes[0].rawValue);
                  }
                } catch {
                  // ignore detection errors
                }
              }
              animRef.current = requestAnimationFrame(loop);
            };
            animRef.current = requestAnimationFrame(loop);
          } else {
            // Fallback: jsQR canvas decode
            const { default: jsQR } = await import('jsqr');
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;

            const loop = () => {
              if (!mounted) return;
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
        }
      };

      init();

      return () => {
        mounted = false;
        cancelAnimationFrame(animRef.current);
        streamRef.current?.getTracks().forEach(t => t.stop());
      };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div className="scanner-viewport">
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className="scanner-video"
        />

        {/* Animated scan frame */}
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
      </div>
    );
  }
);

ScannerView.displayName = 'ScannerView';
export default ScannerView;

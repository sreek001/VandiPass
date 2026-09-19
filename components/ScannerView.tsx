'use client';

import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

interface ScannerViewProps {
  onScan: (data: string) => void;
  active: boolean;
}

export default function ScannerView({ onScan, active }: ScannerViewProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isScanning = useRef(true);

  useEffect(() => {
    isScanning.current = active;
  }, [active]);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animId: number;
    let isCancelled = false;

    const startCamera = async () => {
      try {
        if (!navigator?.mediaDevices?.getUserMedia) {
          if (!isCancelled) {
            setError('Camera permission denied or not available');
          }
          return;
        }

        // Use flexible constraints to avoid OverconstrainedError across devices
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
          },
          audio: false,
        });

        if (isCancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute('playsinline', 'true');

          videoRef.current.onloadedmetadata = async () => {
            try {
              await videoRef.current?.play();
              // Clear any stale error once video is actively rendering
              setError(null);
            } catch (playErr) {
              console.warn('Playback error:', playErr);
            }
          };
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.error('Camera error:', err);
          setError('Camera permission denied or not available');
        }
      }
    };

    startCamera();

    const checkFrame = async () => {
      if (
        isScanning.current &&
        videoRef.current &&
        videoRef.current.readyState >= 2
      ) {
        const video = videoRef.current;

        // 1. Native BarcodeDetector (instant GPU decode)
        if ('BarcodeDetector' in window) {
          try {
            const detector = new (window as any).BarcodeDetector({
              formats: ['qr_code'],
            });
            const barcodes = await detector.detect(video);
            if (barcodes.length > 0 && barcodes[0].rawValue) {
              isScanning.current = false;
              onScan(barcodes[0].rawValue);
              return;
            }
          } catch {}
        }

        // 2. Fallback: jsQR (statically bundled, zero per-frame network overhead)
        try {
          const canvas = canvasRef.current || document.createElement('canvas');
          const ctx = canvas.getContext('2d', { willReadFrequently: true });
          if (ctx) {
            canvas.width = 480;
            canvas.height = 480;
            ctx.drawImage(video, 0, 0, 480, 480);
            const imgData = ctx.getImageData(0, 0, 480, 480);

            const code = jsQR(imgData.data, 480, 480, {
              inversionAttempts: 'attemptBoth',
            });

            if (code && code.data) {
              isScanning.current = false;
              onScan(code.data);
              return;
            }
          }
        } catch {}
      }

      animId = requestAnimationFrame(checkFrame);
    };

    animId = requestAnimationFrame(checkFrame);

    return () => {
      isCancelled = true;
      cancelAnimationFrame(animId);
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
    };
  }, [onScan]);

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden bg-black border border-slate-800 shadow-2xl">
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
        />

        {/* Viewfinder Reticle */}
        <div className="absolute inset-8 border border-white/20 rounded-2xl pointer-events-none flex items-center justify-center">
          <div className="w-full h-0.5 bg-emerald-400 shadow-[0_0_12px_#10b981] animate-pulse" />
        </div>

        {/* Show error ONLY if the stream really isn't providing frames */}
        {error && (
          <div className="absolute inset-0 bg-slate-900/90 flex items-center justify-center p-4 text-center text-xs text-rose-400">
            {error}
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={() => onScan('VANDIPASS:KL-26-4874:Tony Davis:ASIET Kalady:Aluva ⇄ Kalady')}
        className="text-xs text-slate-400 hover:text-emerald-400 border border-slate-800 bg-[#0e1422] px-4 py-2 rounded-xl transition-all shadow-sm"
      >
        ⚡ Test Direct Pass Verification
      </button>
    </div>
  );
}

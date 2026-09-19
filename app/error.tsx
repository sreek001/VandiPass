'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col items-center justify-center p-4">
      <div className="bg-white border border-slate-200 p-7 rounded-3xl max-w-sm text-center space-y-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h2 className="text-lg font-bold text-rose-600">Something went wrong</h2>
        <p className="text-xs text-slate-600 leading-relaxed">{error.message || 'Failed to load transit module.'}</p>
        <button
          onClick={() => reset()}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/25"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

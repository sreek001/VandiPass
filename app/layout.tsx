import type { Metadata, Viewport } from 'next';
import '@/styles/globals.css';

export const metadata: Metadata = {
  title: 'VandiPass // KSRTC Digital Pass Registry',
  description:
    'Zero-network cryptographic attestation engineered for Kerala State Road Transport Corporation — Ed25519 signed concession passes verified offline in under 12ms.',
  keywords: ['KSRTC', 'VandiPass', 'digital bus pass', 'Kerala', 'offline verification', 'Ed25519'],
};

export const viewport: Viewport = {
  themeColor: '#059669',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

import Navbar from '@/components/Navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* Core UI fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Outfit:wght@300;400;500;600;700;800;900&family=Noto+Sans+Malayalam:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {/* Material Symbols for icon spans */}
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          rel="stylesheet"
        />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-[#f8fafc] text-slate-800 antialiased min-h-screen selection:bg-emerald-600 selection:text-white">
        <Navbar />
        {children}
      </body>
    </html>
  );
}


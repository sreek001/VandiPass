'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: 'Overview', href: '/' },
    { name: 'Student', href: '/student' },
    { name: 'Depot', href: '/depot' },
    { name: 'Scanner', href: '/conductor' },
  ];

  return (
    <header className="w-full border-b border-emerald-100 bg-white/85 backdrop-blur-md sticky top-0 z-40 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2 font-extrabold text-slate-900 text-lg tracking-tight hover:opacity-90 transition-opacity">
          <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs font-black shadow-md shadow-emerald-600/30">
            V
          </span>
          <span className="flex items-center gap-1.5">
            <span>VandiPass</span>
            <span className="hidden sm:inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono">
              KSRTC
            </span>
          </span>
        </Link>

        {/* Minimal Nav Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/25' 
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-emerald-50/70'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

      </div>
    </header>
  );
}

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Student Portal', href: '/student' },
    { name: 'Depot Desk', href: '/depot' },
    { name: 'Conductor Terminal', href: '/conductor' },
  ];

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-40 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      {/* Official Government of Kerala Transport Strip */}
      <div className="bg-slate-900 text-slate-300 text-[10px] font-mono tracking-wider py-1 px-4 border-b border-slate-800">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="font-semibold text-slate-200">GOVERNMENT OF KERALA</span>
            <span className="text-slate-500">|</span>
            <span>MOTOR VEHICLES DEPARTMENT</span>
          </div>
          <div className="hidden sm:flex items-center gap-3 text-slate-400 text-[10px]">
            <span>KSRTC SWIFT</span>
            <span>DEPOT NETWORK 042</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-5xl mx-auto px-4 h-15 py-2.5 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
          <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-base shadow-sm border border-emerald-800">
            V
          </div>
          <div>
            <div className="flex items-center gap-1.5 leading-none">
              <span className="font-black text-slate-900 text-base tracking-tight">VandiPass</span>
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                KSRTC
              </span>
            </div>
            <div className="text-[10px] text-slate-500 font-semibold tracking-wide pt-0.5">
              Digital Student Concession System
            </div>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  isActive 
                    ? 'bg-emerald-700 text-white shadow-sm border border-emerald-800' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent'
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

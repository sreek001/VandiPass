'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { GraduationCap, Building2, QrCode, ArrowRight } from 'lucide-react';

interface DemoRole {
  role: string;
  email: string;
  label: string;
  route: string;
  color: string;
  icon: React.ElementType;
}

const DEMO_ROLES: DemoRole[] = [
  {
    role: 'Student Commuter',
    email: 'student@vandipass.com',
    label: 'Student Portal',
    route: '/student',
    color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    icon: GraduationCap,
  },
  {
    role: 'Depot Officer',
    email: 'depot@vandipass.com',
    label: 'Depot Desk',
    route: '/depot',
    color: 'bg-amber-50 text-amber-800 border-amber-200',
    icon: Building2,
  },
  {
    role: 'Bus Conductor',
    email: 'conductor@vandipass.com',
    label: 'Offline Scanner',
    route: '/conductor',
    color: 'bg-sky-50 text-sky-800 border-sky-200',
    icon: QrCode,
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('student@vandipass.com');
  const [password, setPassword] = useState('••••••••••••');
  const [activeTab, setActiveTab] = useState<'signin' | 'register'>('signin');

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('vandipass_user', email);
    router.push('/');
  };

  const handleSelectDemo = (role: DemoRole) => {
    setEmail(role.email);
    localStorage.setItem('vandipass_user', role.email);
    router.push('/');
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-[#f8fafc] text-slate-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        
        {/* Top Branding matching UniHub layout */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 p-2 mx-auto flex items-center justify-center shadow-sm">
            <Image
              src="/logo.png"
              alt="VandiPass Logo"
              width={64}
              height={64}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">VandiPass Access</h1>
          <p className="text-xs text-slate-500">Unified transit portal — sign in to proceed</p>
        </div>

        {/* Card Form */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-sm space-y-4">
          
          {/* Sign In / Register Switcher */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('signin')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'signin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500'
              }`}
            >
              Register
            </button>
          </div>

          <form onSubmit={handleSignIn} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-600 font-bold mb-1">Transit Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-bold mb-1">Security Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold transition-all text-xs shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Sign In to Terminal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Demo Accounts Presets matching UniHub */}
        <div className="space-y-2">
          <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block text-center">
            Demo Accounts · Click to pre-fill credentials
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {DEMO_ROLES.map((role) => {
              const Icon = role.icon;
              return (
                <button
                  key={role.email}
                  type="button"
                  onClick={() => handleSelectDemo(role)}
                  className={`p-3 rounded-2xl border text-left flex flex-col justify-between space-y-2 hover:scale-[1.02] transition-transform ${role.color}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase">{role.role.split(' ')[0]}</span>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="text-[10px] font-mono truncate opacity-85">{role.email}</div>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

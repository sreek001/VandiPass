import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-6 flex flex-col items-center">
      <div className="max-w-2xl bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs leading-relaxed">
        <h1 className="text-xl font-black text-slate-900">VandiPass Privacy Policy</h1>
        <p>1. Student identification data and uploaded enrolment certificates are stored securely in cloud transit registries solely for corridor approval.</p>
        <p>2. Conductor verification operates completely offline on local device memory without real-time passenger location tracking.</p>
        <Link href="/" className="text-emerald-700 font-bold inline-block pt-2">← Return to Home</Link>
      </div>
    </div>
  );
}

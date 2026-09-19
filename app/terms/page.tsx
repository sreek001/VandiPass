import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-6 flex flex-col items-center">
      <div className="max-w-2xl bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs leading-relaxed">
        <h1 className="text-xl font-black text-slate-900">KSRTC Student Concession Terms & Conditions</h1>
        <p>1. Concession passes issued through VandiPass are valid exclusively for enrolled students traveling between approved residential and institutional bus stops.</p>
        <p>2. Pass verification is carried out offline by bus conductors using the VandiPass digital optical scanner engine.</p>
        <p>3. Fraudulent alteration of pass credentials or transfer of passes to unauthorized individuals results in immediate revocation.</p>
        <Link href="/" className="text-emerald-700 font-bold inline-block pt-2">← Return to Home</Link>
      </div>
    </div>
  );
}

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800">
      <main className="max-w-4xl mx-auto px-4 py-12 sm:py-16 space-y-10">
        
        {/* Simple Header */}
        <div className="text-center space-y-3">
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            KSRTC Digital Student Concession
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Fast, Offline Student Bus Passes
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Apply online, receive verified digital passes, and travel smoothly with instant offline verification.
          </p>
        </div>

        {/* 3 Unified Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold text-sm">
                01
              </div>
              <h2 className="text-lg font-bold text-slate-900">Student Hub</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Apply for a new pass, check approval status, and present your digital QR pass.
              </p>
            </div>
            <Link 
              href="/student"
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold text-center hover:bg-black transition-colors"
            >
              Open Student Hub
            </Link>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm">
                02
              </div>
              <h2 className="text-lg font-bold text-slate-900">Depot Desk</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Review student applications, verify routes, and issue signed digital passes.
              </p>
            </div>
            <Link 
              href="/depot"
              className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold text-center hover:bg-black transition-colors"
            >
              Open Depot Desk
            </Link>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                03
              </div>
              <h2 className="text-lg font-bold text-slate-900">Conductor Scanner</h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Scan passes in real time. Works completely offline with instant pass clearance.
              </p>
            </div>
            <Link 
              href="/conductor"
              className="w-full py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold text-center hover:bg-emerald-700 transition-colors"
            >
              Launch Scanner
            </Link>
          </div>

        </div>

        {/* Minimal Footer */}
        <div className="pt-8 border-t border-slate-200 text-center text-xs text-slate-400">
          Kerala State Road Transport Corporation · VandiPass
        </div>

      </main>
    </div>
  );
}

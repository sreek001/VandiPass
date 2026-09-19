'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RotateCw, Check, X, Eye, XSquare } from 'lucide-react';

export default function DepotPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeProofUrl, setActiveProofUrl] = useState<string | null>(null);

  const fetchApplications = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    setApplications(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: 'APPROVED' | 'REJECTED') => {
    await supabase.from('applications').update({ status: newStatus }).eq('id', id);
    await fetchApplications();
  };

  const pendingCount = applications.filter((a) => a.status === 'PENDING').length;
  const approvedCount = applications.filter((a) => a.status === 'APPROVED').length;

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-3xl space-y-5">
        
        {/* Header */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
          <div>
            <span className="text-[10px] font-mono text-emerald-700 font-bold uppercase tracking-wider">
              DEPOT 042 · ALUVA CONCESSION DESK
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Application Verification
            </h1>
            <p className="text-xs text-slate-500">Live corridor and ID card inspection</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-mono font-bold">
              {pendingCount} PENDING
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-mono font-bold">
              {approvedCount} APPROVED
            </span>
            <button
              onClick={fetchApplications}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Refresh records"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Application Cards */}
        {loading ? (
          <div className="text-center py-12 text-slate-400 font-mono text-xs">
            Querying Supabase database...
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-xs text-slate-500">
            No applications found in the database.
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-base">{app.student_name}</span>
                    <span className="text-xs text-slate-400 font-mono">({app.id})</span>
                  </div>
                  <div className="text-xs text-slate-500">{app.institution}</div>
                  <div className="text-xs font-bold text-emerald-700 font-mono">{app.route}</div>
                  <div className="text-[11px] text-slate-400">{app.student_email}</div>

                  {app.id_card_url && (
                    <button
                      onClick={() => setActiveProofUrl(app.id_card_url)}
                      className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold inline-flex items-center gap-1 pt-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect ID Proof</span>
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {app.status === 'PENDING' ? (
                    <>
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'APPROVED')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition-all"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(app.id, 'REJECTED')}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold flex items-center gap-1 transition-all"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  ) : (
                    <span
                      className={`text-xs font-mono font-bold px-3 py-1 rounded-xl border ${
                        app.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      {app.status}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Verification Lightbox Modal for Depot Officer */}
        {activeProofUrl && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-5 max-w-lg w-full space-y-3 shadow-2xl">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="text-xs font-bold text-slate-800">Student ID Proof Document</span>
                <button
                  onClick={() => setActiveProofUrl(null)}
                  className="p-1 text-slate-400 hover:text-slate-800"
                >
                  <XSquare className="w-5 h-5" />
                </button>
              </div>

              <div className="max-h-[70vh] overflow-auto flex justify-center bg-slate-50 rounded-2xl p-2 border border-slate-100">
                <img
                  src={activeProofUrl}
                  alt="Student Proof Document"
                  className="rounded-xl object-contain max-w-full"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => setActiveProofUrl(null)}
                  className="px-4 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-bold"
                >
                  Done Inspecting
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
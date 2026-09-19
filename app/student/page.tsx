'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { QRCodeSVG } from 'qrcode.react';
import { Clock, CheckCircle2, XCircle, Plus, Paperclip, ArrowRightLeft } from 'lucide-react';

const ERNAKULAM_STATIONS = [
  'Aluva',
  'Kalady',
  'Angamaly',
  'Perumbavoor',
  'Edappally',
  'Vyttila Mobility Hub',
  'Ernakulam KSRTC Stand',
  'Kakkanad (Infopark)',
  'North Paravur',
  'Kothamangalam',
  'Muvattupuzha',
  'Kalamassery',
  'Tripunithura',
];

export default function StudentPage() {
  const [activeTab, setActiveTab] = useState<'pass' | 'apply'>('pass');
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('student@vandipass.com');
  const [institution, setInstitution] = useState('');
  const [source, setSource] = useState('Aluva');
  const [destination, setDestination] = useState('Kalady');
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchApplications = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      setApplications(data);
    } else {
      setApplications([]);
      setActiveTab('apply');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (source === destination) {
      alert('Source and destination cannot be identical.');
      return;
    }

    setSubmitting(true);
    let fileUrl = '';

    try {
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { data: uploadData, error: uploadErr } = await supabase.storage
          .from('id_proofs')
          .upload(fileName, file);

        if (!uploadErr && uploadData) {
          const { data: pubUrl } = supabase.storage
            .from('id_proofs')
            .getPublicUrl(fileName);
          fileUrl = pubUrl.publicUrl;
        }
      }

      const generatedId = `KL-26-${Math.floor(1000 + Math.random() * 9000)}`;
      const combinedRoute = `${source} ⇄ ${destination}`;

      const { error } = await supabase.from('applications').insert([
        {
          id: generatedId,
          student_email: email,
          student_name: name,
          institution,
          route: combinedRoute,
          id_card_url: fileUrl,
          status: 'PENDING',
        },
      ]);

      if (error) throw error;

      setName('');
      setInstitution('');
      setFile(null);
      setPreviewUrl(null);
      await fetchApplications();
      setActiveTab('pass');
    } catch (err: any) {
      alert('Failed to submit application: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-xl space-y-5">
        
        {/* White Header Banner */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 flex justify-between items-center shadow-sm">
          <div>
            <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-wider">
              COMMUTER WALLET
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Student Concession Pass</h1>
            <p className="text-xs text-slate-500">Official digital pass portal</p>
          </div>
          <button
            onClick={() => setActiveTab('apply')}
            className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Application</span>
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-200/70 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab('pass')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'pass' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Passes ({applications.length})
          </button>
          <button
            onClick={() => setActiveTab('apply')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'apply' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Submit Application
          </button>
        </div>

        {/* TAB 1: PASS CARDS */}
        {activeTab === 'pass' && (
          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-12 text-slate-400 font-mono text-xs">
                Fetching passes from Supabase...
              </div>
            ) : applications.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center space-y-3 shadow-sm">
                <p className="text-slate-500 text-xs">No concession pass applications found.</p>
                <button
                  onClick={() => setActiveTab('apply')}
                  className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
                >
                  Create Application
                </button>
              </div>
            ) : (
              applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5"
                >
                  <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">STUDENT COMMUTER</span>
                      <h2 className="text-xl font-black text-slate-900">{app.student_name}</h2>
                      <p className="text-xs font-bold text-emerald-700">{app.route}</p>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                        app.status === 'APPROVED'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : app.status === 'REJECTED'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}
                    >
                      {app.status === 'APPROVED' && <CheckCircle2 className="w-3 h-3" />}
                      {app.status === 'REJECTED' && <XCircle className="w-3 h-3" />}
                      {app.status === 'PENDING' && <Clock className="w-3 h-3" />}
                      <span>{app.status}</span>
                    </span>
                  </div>

                  {app.status === 'APPROVED' ? (
                    <div className="flex flex-col items-center py-2 space-y-3">
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl shadow-sm">
                        <QRCodeSVG
                          value={`VANDIPASS:${app.id}:${app.student_name}:${app.institution}:${app.route}`}
                          size={180}
                          level="L"
                          includeMargin={true}
                        />
                      </div>
                      <span className="text-[11px] font-mono text-emerald-700 font-bold">✓ Ready for Bus Verification</span>
                    </div>
                  ) : (
                    <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-5 text-center space-y-1">
                      <span className="text-amber-800 font-bold text-xs block">Application Under Review</span>
                      <p className="text-[11px] text-slate-600">
                        Application <span className="font-mono font-bold text-slate-800">{app.id}</span> is under verification. Once confirmed by depot officers, your QR pass will activate here.
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 text-xs font-mono border-t border-slate-100 pt-3 text-slate-600">
                    <div>
                      <span className="text-[10px] text-slate-400 block">INSTITUTION</span>
                      <span className="font-bold text-slate-800 truncate block">{app.institution}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">PASS ID</span>
                      <span className="font-bold text-slate-800 block">{app.id}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: APPLICATION FORM WITH SPLIT CORRIDORS */}
        {activeTab === 'apply' && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5">
            <div>
              <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase">FORM KSRTC-CONC-01</span>
              <h2 className="text-xl font-bold text-slate-900">New Concession Pass Application</h2>
              <p className="text-xs text-slate-500">Route approval for Ernakulam operational corridor</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Legal Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Tony Davis"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Student Email Address *</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@vandipass.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">College / School Name *</label>
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="e.g. ASIET Kalady"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Split Travel Corridor Dropdowns */}
              <div className="space-y-1">
                <label className="block text-slate-700 font-bold">Approved Travel Corridor *</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">BOARDING POINT (SOURCE)</span>
                    <select
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-emerald-500 text-xs cursor-pointer font-medium"
                    >
                      {ERNAKULAM_STATIONS.map((station) => (
                        <option key={`src-${station}`} value={station}>
                          {station}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 block mb-1">DESTINATION (INSTITUTION STOP)</span>
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:border-emerald-500 text-xs cursor-pointer font-medium"
                    >
                      {ERNAKULAM_STATIONS.map((station) => (
                        <option key={`dst-${station}`} value={station}>
                          {station}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-700 pt-1 font-semibold">
                  <ArrowRightLeft className="w-3 h-3" />
                  <span>Route Corridor: {source} ⇄ {destination}</span>
                </div>
              </div>

              {/* ID Proof Upload with Image Preview */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Upload College ID / Proof File *</label>
                <div className="border border-dashed border-slate-300 rounded-2xl p-4 text-center bg-slate-50">
                  <input
                    type="file"
                    id="proof-upload"
                    required
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="proof-upload"
                    className="cursor-pointer px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-bold inline-flex items-center gap-1.5 shadow-sm hover:bg-slate-100 transition-colors"
                  >
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>{file ? file.name : 'Browse Files'}</span>
                  </label>
                  <p className="text-[10px] text-slate-400 mt-1.5">Official Student ID or Principal Enrolment Certificate</p>

                  {/* Immediate Image Preview */}
                  {previewUrl && (
                    <div className="mt-3 flex justify-center">
                      <img
                        src={previewUrl}
                        alt="ID Preview"
                        className="max-h-36 rounded-xl border border-slate-200 shadow-sm object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md text-xs"
              >
                {submitting ? 'Submitting Application...' : 'Submit Application & Queue for Verification'}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

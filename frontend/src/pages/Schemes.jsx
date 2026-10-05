import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '../services/api';
import {
  GraduationCap,
  Sparkles,
  Loader2,
  X,
  FileText,
  HelpCircle,
  ClipboardList
} from 'lucide-react';

const Schemes = () => {
  const [showMatchForm, setShowMatchForm] = useState(false);
  const [showMatchResults, setShowMatchResults] = useState(false);

  // Business Match attributes state
  const [turnover, setTurnover] = useState('');
  const [employees, setEmployees] = useState('');
  const [ownerCategory, setOwnerCategory] = useState('General');
  const [projectCost, setProjectCost] = useState('');
  const [businessIndustry, setBusinessIndustry] = useState('');

  // Fetch Scheme Lists
  const { data: schemesRes, isLoading } = useQuery({
    queryKey: ['schemes'],
    queryFn: async () => {
      const res = await api.get('/schemes');
      return res.data;
    }
  });

  const schemes = Array.isArray(schemesRes) ? schemesRes : (schemesRes?.data || []);

  // Match Scheme Mutation
  const matchMutation = useMutation({
    mutationFn: async (attributes) => {
      const res = await api.post('/schemes/match', { businessAttributes: attributes });
      return res.data;
    },
    onSuccess: () => {
      setShowMatchForm(false);
      setShowMatchResults(true);
    }
  });

  const handleMatchSubmit = (e) => {
    e.preventDefault();
    matchMutation.mutate({
      turnover: `Rs. ${turnover} Lakhs`,
      employeesCount: employees,
      ownerSocialCategory: ownerCategory,
      estimatedProjectCost: `Rs. ${projectCost} Lakhs`,
      sector: businessIndustry,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Government Scheme Advisor</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Discover subsidies and collateral-free credit schemes pre-approved for micro and small industries in India.</p>
        </div>
        <button
          onClick={() => setShowMatchForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-colors w-fit"
        >
          <Sparkles className="h-4 w-4" /> Check AI Eligibility
        </button>
      </div>

      {/* AI Eligibility Input Form */}
      {showMatchForm && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleMatchSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-md shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900/50">
              <h3 className="font-bold text-sm flex items-center gap-1.5 text-slate-900 dark:text-white">
                <Sparkles className="h-4 w-4 text-blue-500" /> Enterprise Attributes Audit
              </h3>
              <button type="button" onClick={() => setShowMatchForm(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Company Sector</label>
                <input
                  type="text"
                  value={businessIndustry}
                  onChange={(e) => setBusinessIndustry(e.target.value)}
                  placeholder="E.g. Food Processing, Brass Hardware"
                  required
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Turnover (₹ Lakhs/Yr)</label>
                  <input
                    type="number"
                    value={turnover}
                    onChange={(e) => setTurnover(e.target.value)}
                    required
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Number of Employees</label>
                  <input
                    type="number"
                    value={employees}
                    onChange={(e) => setEmployees(e.target.value)}
                    required
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Project Cost (₹ Lakhs)</label>
                  <input
                    type="number"
                    value={projectCost}
                    onChange={(e) => setProjectCost(e.target.value)}
                    required
                    className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">Owner Social Category</label>
                  <select
                    value={ownerCategory}
                    onChange={(e) => setOwnerCategory(e.target.value)}
                    className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none"
                  >
                    <option value="General">General</option>
                    <option value="SC/ST">SC / ST</option>
                    <option value="OBC">OBC</option>
                    <option value="Women Owned">Women Owned</option>
                    <option value="Physically Handicapped">Physically Handicapped</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowMatchForm(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-colors"
              >
                Analyze Match
              </button>
            </div>
          </form>
        </div>
      )}

      {/* AI Recommendation Results Modal */}
      {showMatchResults && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh] shadow-lg">
            <div className="p-6 border-b border-slate-250 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-400" />
                <h3 className="font-bold text-lg">AI Scheme Advisor Report</h3>
              </div>
              <button onClick={() => setShowMatchResults(false)} className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto text-slate-700 dark:text-slate-300 space-y-4 text-sm leading-relaxed prose dark:prose-invert max-w-none">
              {matchMutation.isPending ? (
                <div className="flex flex-col items-center justify-center py-12 gap-3 text-slate-400">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                  <p className="text-xs font-semibold">Running matching matrix algorithms...</p>
                </div>
              ) : (
                <div className="whitespace-pre-line">
                  {matchMutation.data?.data || 'No matches found.'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Schemes Grid */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-xs font-medium">Fetching scheme databases...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schemes.map((scheme) => (
            <div key={scheme._id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-1">
                    <h3 className="font-extrabold text-slate-900 dark:text-slate-100 text-sm leading-snug">{scheme.name}</h3>
                    <p className="text-[10px] font-bold text-slate-450 uppercase">{scheme.ministry}</p>
                  </div>
                  <div className="h-9 w-9 bg-blue-500/10 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <GraduationCap className="h-4.5 w-4.5" />
                  </div>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{scheme.description}</p>

                {/* Subsidies details */}
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 rounded-2xl space-y-3 text-xs">
                  <div className="space-y-1">
                    <span className="flex items-center gap-1.5 font-bold text-[9px] text-slate-400 uppercase tracking-wider">
                      <ClipboardList className="h-3.5 w-3.5" /> Benefits Description
                    </span>
                    <p className="text-slate-650 dark:text-slate-350 leading-relaxed font-medium">{scheme.benefits}</p>
                  </div>
                  
                  <div className="space-y-1 border-t border-slate-200 dark:border-slate-800 pt-2.5">
                    <span className="flex items-center gap-1.5 font-bold text-[9px] text-slate-400 uppercase tracking-wider">
                      <FileText className="h-3.5 w-3.5" /> Checklist Required
                    </span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-500">
                      {scheme.documentsRequired.map((doc, idx) => (
                        <li key={idx}>{doc}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-100 dark:border-slate-850">
                <span className="text-[10px] text-slate-400">Scheme Code ID: {scheme._id.substring(18)}</span>
                <a
                  href={scheme.officialLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-950 text-xs font-semibold transition-colors"
                >
                  Official Portal
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Schemes;

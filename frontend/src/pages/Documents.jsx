import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useApp } from '../context/AppContext';
import {
  FileText,
  UploadCloud,
  Loader2,
  X,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Send,
  Eye
} from 'lucide-react';

const Documents = () => {
  const queryClient = useQueryClient();
  const { showToast } = useApp();
  const [selectedDocId, setSelectedDocId] = useState(null);
  const [question, setQuestion] = useState('');
  const [qaHistory, setQaHistory] = useState([]);
  const [qaLoading, setQaLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  // Fetch Documents
  const { data: docsRes, isLoading } = useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const res = await api.get('/documents');
      return res.data;
    },
    // Poll documents every 5 seconds while processing
    refetchInterval: (query) => {
      const docs = query.state.data?.data || [];
      const hasProcessing = docs.some(d => d.status === 'Processing' || d.status === 'Uploading');
      return hasProcessing ? 5000 : false;
    }
  });

  const documents = Array.isArray(docsRes) ? docsRes : (docsRes?.data || []);
  const activeDocId = selectedDocId || (documents.length > 0 ? documents[0]._id : null);

  // Fetch Selected Document Detail
  const { data: selectedDocRes, isLoading: docLoading } = useQuery({
    queryKey: ['document', activeDocId],
    queryFn: async () => {
      if (!activeDocId) return null;
      const res = await api.get(`/documents/${activeDocId}`);
      return res.data;
    },
    enabled: !!activeDocId
  });

  const selectedDoc = selectedDocRes?.data || (documents.length > 0 ? documents.find(d => d._id === activeDocId) : null);

  // File Upload handler
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadMsg('');
    const formData = new FormData();
    formData.append('file', file);

    try {
      await api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      queryClient.invalidateQueries(['documents']);
      setUploadMsg('File uploaded successfully! AI analysis triggered.');
      showToast('Document uploaded successfully! Parsing OCR content...', 'success');
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'File upload failed.';
      setUploadMsg(errMsg);
      showToast(errMsg, 'error');
    } finally {
      setUploading(false);
    }
  };

  // Ask Q&A handler
  const handleAskQuestion = async (e) => {
    e.preventDefault();
    if (!question.trim() || !selectedDocId) return;

    setQaLoading(true);
    const userQuery = question;
    setQuestion('');

    // Append to local Q&A logs
    setQaHistory(prev => [...prev, { role: 'user', content: userQuery }]);

    try {
      const res = await api.post(`/documents/${selectedDocId}/ask`, { question: userQuery });
      setQaHistory(prev => [...prev, { role: 'model', content: res.data.data }]);
    } catch (err) {
      console.error(err);
      const errMsg = 'Could not process question. Ensure document status is completed.';
      setQaHistory(prev => [...prev, { role: 'model', content: errMsg }]);
      showToast('Failed to resolve document analysis Q&A.', 'error');
    } finally {
      setQaLoading(false);
    }
  };

  const handleSelectDoc = (id) => {
    setSelectedDocId(id);
    setQaHistory([]);
    setQuestion('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold">Document Hub & OCR</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Upload suppliers invoices, delivery slips, or trade agreements. Gemini AI extracts values, summaries, and opens a context Q&A box.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Upload and list column */}
        <div className="space-y-6 lg:col-span-1">
          {/* Upload card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-450 uppercase tracking-widest">Upload Files</h3>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-blue-500/50 rounded-2xl p-6 cursor-pointer hover:bg-slate-50/50 dark:hover:bg-slate-950/20 transition-all text-center">
              <UploadCloud className="h-8 w-8 text-slate-400 mb-2" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">Drag or click to upload</span>
              <span className="text-[10px] text-slate-450 mt-1">PDF, PNG, JPG (Max 10MB)</span>
              <input type="file" onChange={handleFileUpload} accept=".pdf,.png,.jpg,.jpeg" className="hidden" />
            </label>

            {uploading && (
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-500">
                <Loader2 className="h-4 w-4 animate-spin" /> Uploading & indexing file...
              </div>
            )}

            {uploadMsg && (
              <div className="p-3 bg-blue-500/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 rounded-xl text-[10px] font-semibold">
                {uploadMsg}
              </div>
            )}
          </div>

          {/* Documents lists */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-slate-450 uppercase tracking-widest">Document Log</h3>

            {isLoading ? (
              <div className="flex items-center justify-center py-10 text-slate-400">
                <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              </div>
            ) : documents.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-6">No uploads registered yet.</p>
            ) : (
              <div className="space-y-3 max-h-[40vh] overflow-y-auto">
                {documents.map((doc) => {
                  const isSelected = doc._id === selectedDocId;
                  return (
                    <button
                      key={doc._id}
                      onClick={() => handleSelectDoc(doc._id)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-blue-600/10 border-blue-500/30 text-blue-600 dark:text-blue-400 font-bold'
                          : 'border-slate-100 dark:border-slate-850 hover:bg-slate-50/50 dark:hover:bg-slate-900/30'
                      }`}
                    >
                      <div className="min-w-0 flex-1 pr-2">
                        <p className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200">{doc.fileName}</p>
                        <span className={`inline-block text-[9px] font-bold mt-1 uppercase ${
                          doc.status === 'Completed'
                            ? 'text-emerald-500'
                            : doc.status === 'Processing'
                            ? 'text-blue-500'
                            : 'text-rose-500'
                        }`}>
                          {doc.status}
                        </span>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 shrink-0" />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* View and Ask details column */}
        <div className="lg:col-span-2 space-y-6">
          {!selectedDocId ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center h-[65vh] flex flex-col items-center justify-center shadow-sm">
              <FileText className="h-12 w-12 text-slate-300 dark:text-slate-700 mb-4" />
              <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No Document Selected</h4>
              <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 max-w-xs">
                Select a processed file from the document log sidebar to view summary parameters and ask AI questions.
              </p>
            </div>
          ) : docLoading ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center h-[65vh] flex flex-col items-center justify-center shadow-sm">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <p className="text-xs font-medium text-slate-500 mt-2">Compiling document details...</p>
            </div>
          ) : selectedDoc ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[65vh]">
              {/* Summary Screen */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate max-w-xs">{selectedDoc.fileName}</h3>
                    <p className="text-[10px] text-slate-450 mt-0.5">Uploaded on {new Date(selectedDoc.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded font-bold text-[9px] uppercase tracking-wider ${
                    selectedDoc.status === 'Completed'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-blue-500/10 text-blue-600'
                  }`}>
                    {selectedDoc.status}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto pr-2 divide-y divide-slate-100 dark:divide-slate-850 space-y-4">
                  <div>
                    <span className="block text-[9px] font-bold text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" /> AI Summary & Extracted Fields
                    </span>
                    <div className="text-xs text-slate-650 dark:text-slate-350 leading-relaxed whitespace-pre-line">
                      {selectedDoc.summary || 'Summary is being computed. Check back in a few seconds.'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Chat Screen */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col overflow-hidden">
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-widest text-slate-400 mb-4 border-b border-slate-100 dark:border-slate-850 pb-3">
                  <MessageSquare className="h-4 w-4" /> Contextual Q&A
                </div>

                {/* Conversation logs */}
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 text-xs">
                  {qaHistory.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center text-slate-450 gap-2">
                      <MessageSquare className="h-6 w-6 text-slate-300 dark:text-slate-700" />
                      <p className="text-[10px]">Ask questions like "What is the total GST amount?" or "Who is the vendor?"</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {qaHistory.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed ${
                            msg.role === 'user'
                              ? 'bg-blue-600 text-white rounded-tr-none'
                              : 'bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 text-slate-800 dark:text-slate-200 rounded-tl-none'
                          }`}>
                            {msg.content}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {qaLoading && (
                    <div className="flex justify-start">
                      <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-3 rounded-2xl rounded-tl-none flex items-center gap-2 text-slate-400">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" /> Querying document parameters...
                      </div>
                    </div>
                  )}
                </div>

                {/* Question input */}
                <form onSubmit={handleAskQuestion} className="flex gap-2 border-t border-slate-100 dark:border-slate-850 pt-4 mt-4">
                  <input
                    type="text"
                    placeholder="Ask a question about this document..."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={selectedDoc.status !== 'Completed' || qaLoading}
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={!question.trim() || qaLoading || selectedDoc.status !== 'Completed'}
                    className="p-2.5 rounded-xl bg-blue-600 text-white shadow hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Documents;

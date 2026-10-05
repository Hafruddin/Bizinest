import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { useApp } from '../context/AppContext';
import {
  LifeBuoy,
  Plus,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  X
} from 'lucide-react';

const Support = () => {
  const queryClient = useQueryClient();
  const { showToast } = useApp();
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [formMsg, setFormMsg] = useState('');

  // Fetch Tickets
  const { data: ticketsRes, isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      const res = await api.get('/support/tickets');
      return res.data;
    }
  });

  const tickets = Array.isArray(ticketsRes) ? ticketsRes : (ticketsRes?.data || []);

  // Create Ticket Mutation
  const createMutation = useMutation({
    mutationFn: async (ticketData) => {
      return await api.post('/support/tickets', ticketData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tickets']);
      showToast('Support ticket logged successfully!', 'success');
      setShowAddForm(false);
      setTitle('');
      setDescription('');
      setCustomerName('');
      setCustomerEmail('');
      setPriority('Medium');
      setFormMsg('');
    },
    onError: (err) => {
      const errMsg = err.response?.data?.message || 'Failed to submit ticket.';
      setFormMsg(errMsg);
      showToast(errMsg, 'error');
    }
  });

  // Update Status Mutation
  const statusMutation = useMutation({
    mutationFn: async ({ id, status }) => {
      return await api.put(`/support/tickets/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['tickets']);
      showToast('Ticket status updated.', 'success');
    }
  });

  const handleCreateTicket = (e) => {
    e.preventDefault();
    createMutation.mutate({
      title,
      description,
      customerName,
      customerEmail,
      priority,
    });
  };

  const handleStatusUpdate = (id, newStatus) => {
    statusMutation.mutate({ id, status: newStatus });
  };

  const filteredTickets = tickets.filter(t =>
    t.title.toLowerCase().includes(search.toLowerCase()) ||
    t.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Support & Helpdesk</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Manage client query logs, resolve customer complaint tickets, and review response rates.</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-colors w-fit"
        >
          <Plus className="h-4 w-4" /> Log Support Query
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm flex items-center">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ticket title or customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs font-medium pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Log Ticket Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCreateTicket} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
              <h3 className="font-bold text-base">Log Support Query</h3>
              <button type="button" onClick={() => setShowAddForm(false)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            {formMsg && (
              <div className="mx-6 mt-4 p-3 bg-red-500/10 border border-red-500/20 text-red-600 rounded-xl text-xs font-semibold">
                {formMsg}
              </div>
            )}

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Customer Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  required
                  placeholder="Karan Johar"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Customer Email</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  required
                  placeholder="karan@example.com"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:outline-none"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                  <option value="Critical">Critical Priority</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Ticket Summary</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="E.g. Damaged valve shipped in order #INV-0042"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Query Details</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows="3"
                  className="w-full text-xs font-medium px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-950 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-colors disabled:opacity-50"
              >
                {createMutation.isPending ? 'Logging...' : 'Log Query'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tickets List */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <p className="text-xs font-medium">Fetching support tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="text-center py-20">
            <LifeBuoy className="h-12 w-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h4 className="font-bold text-slate-700 dark:text-slate-300 text-sm">No Support Queries</h4>
            <p className="text-xs text-slate-500 dark:text-slate-450 mt-1 mb-6">Log support queries to track client communication resolve counts.</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white font-semibold text-xs hover:bg-blue-700 transition-colors shadow-md shadow-blue-500/10"
            >
              <Plus className="h-4 w-4" /> Log Query
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/50 text-[10px] uppercase font-bold tracking-wider text-slate-500">
                  <th className="py-4 px-6">Ticket Summary</th>
                  <th className="py-4 px-4">Client Detail</th>
                  <th className="py-4 px-4">Priority</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-center">Resolve</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-xs">
                {filteredTickets.map((ticket) => (
                  <tr key={ticket._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="py-4 px-6 font-semibold">
                      <div>
                        <div className="text-slate-900 dark:text-slate-100">{ticket.title}</div>
                        <div className="text-[10px] text-slate-450 mt-0.5">{ticket.description}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-slate-650 dark:text-slate-350">
                      <div>
                        <div>{ticket.customerName}</div>
                        <div className="text-[10px] text-slate-450">{ticket.customerEmail}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-bold">
                      <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-wider ${
                        ticket.priority === 'Critical' || ticket.priority === 'High'
                          ? 'bg-rose-500/10 text-rose-500'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                      }`}>
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center gap-1.5 justify-start text-[10px] font-bold">
                        {ticket.status === 'Resolved' ? (
                          <span className="flex items-center gap-1 text-emerald-500">
                            <CheckCircle className="h-3.5 w-3.5" /> Resolved
                          </span>
                        ) : ticket.status === 'In_Progress' ? (
                          <span className="flex items-center gap-1 text-blue-500">
                            <Clock className="h-3.5 w-3.5 animate-pulse" /> In Progress
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-rose-500">
                            <AlertCircle className="h-3.5 w-3.5" /> Open
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {ticket.status !== 'Resolved' && (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => handleStatusUpdate(ticket._id, 'In_Progress')}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-650 hover:text-blue-500 transition-colors text-[10px] font-semibold"
                          >
                            Assign
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(ticket._id, 'Resolved')}
                            className="p-1.5 rounded-lg border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/5 transition-colors"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Support;

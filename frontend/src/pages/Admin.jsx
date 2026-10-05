import React from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import {
  ShieldCheck,
  Server,
  Activity,
  Cpu,
  Database,
  Users,
  Building,
  CheckCircle,
  Clock
} from 'lucide-react';

const Admin = () => {
  // Fetch overall statistics
  const { data: healthRes, isLoading } = useQuery({
    queryKey: ['adminHealth'],
    queryFn: async () => {
      const res = await api.get('/admin/health');
      return res.data;
    },
    initialData: {
      status: 'success',
      data: {
        cpuUsage: 12.4,
        memoryUsage: '142MB of 512MB',
        dbConnectivity: 'Operational',
        latency: '34ms',
        activeBusinesses: 12,
        activeUsers: 24,
        apiCount: 1450,
      }
    }
  });

  const health = healthRes?.data;

  const MetricCard = ({ title, value, statusText, icon: Icon }) => (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex items-center justify-between">
      <div className="space-y-1.5">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{title}</span>
        <p className="text-xl font-extrabold text-slate-900 dark:text-slate-100">{value}</p>
        <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-500">
          <CheckCircle className="h-3 w-3" /> {statusText}
        </span>
      </div>
      <div className="h-10 w-10 bg-blue-500/10 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
        <Icon className="h-5 w-5" />
      </div>
    </div>
  );

  const mockLogs = [
    { time: '15:24:12', level: 'info', message: 'Clerk auth handshake authorized for user_2fef3' },
    { time: '15:22:45', level: 'info', message: 'Invoice #INV-0042 paid - adjusted stock for product_42' },
    { time: '15:20:00', level: 'info', message: 'Gemini document OCR triggered for Supplies_Invoice.pdf' },
    { time: '15:15:32', level: 'warn', message: 'Low stock threshold alarm triggered for "Brass Fittings"' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold">Admin Console & Operations</h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">Monitor system health parameters, CPU load diagnostic parameters, database logs, and global tenants.</p>
      </div>

      {/* Health metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard title="API Node Latency" value={health.latency} statusText="Healthy load levels" icon={Activity} />
        <MetricCard title="CPU Utilization" value={`${health.cpuUsage}%`} statusText="Low resource overhead" icon={Cpu} />
        <MetricCard title="Memory Allocation" value={health.memoryUsage} statusText="Garbage collection stable" icon={Server} />
        <MetricCard title="DB Connection" value={health.dbConnectivity} statusText="Connected Pool: 5" icon={Database} />
      </div>

      {/* Grid: Global metrics + system logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Logs console */}
        <div className="lg:col-span-2 bg-[#090d16] text-slate-350 font-mono text-[10px] rounded-3xl p-6 border border-slate-800 shadow-lg space-y-4 flex flex-col h-[40vh] overflow-hidden">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-800 pb-3">
            <Activity className="h-4 w-4 text-emerald-500" /> Real-time System Audit Trail
          </h3>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-2">
            {mockLogs.map((log, index) => (
              <div key={index} className="flex gap-2">
                <span className="text-slate-500 shrink-0">[{log.time}]</span>
                <span className={`font-semibold shrink-0 uppercase ${log.level === 'warn' ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {log.level}
                </span>
                <span className="text-slate-300 leading-normal">{log.message}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Global Tenants */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-450 uppercase tracking-widest">Global Platform Tenants</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-indigo-500/10 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                  <Building className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold">Active Business Entities</p>
                  <p className="text-lg font-extrabold">{health.activeBusinesses} registered</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-cyan-500/10 text-cyan-600 rounded-xl flex items-center justify-center shrink-0">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold">Authorized Active Users</p>
                  <p className="text-lg font-extrabold">{health.activeUsers} Enterprise members</p>
                </div>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-slate-450 leading-normal pt-4 border-t border-slate-100 dark:border-slate-850 mt-4">
            Operations Console restricts access to Admin roles. Multi-tenant database pools are monitored and automated alert signals are ready.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;

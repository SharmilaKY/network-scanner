import React from 'react';
import { ShieldCheck, ShieldAlert, Clock, Target, Server } from 'lucide-react';

export default function SummaryCards({ scanStatus }) {
  if (!scanStatus || scanStatus.status !== 'completed') return null;

  const totalPorts = scanStatus.total_ports || 0;
  const openPorts = scanStatus.open_ports_count || 0;
  const closedPorts = Math.max(0, totalPorts - openPorts);
  const duration = scanStatus.duration || 0;
  const isReachable = scanStatus.reachable === true;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* Total Scanned */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 shadow-md flex items-center space-x-3.5">
        <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
          <Target className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Total Scanned</p>
          <p className="text-xl font-extrabold text-white font-mono mt-0.5">{totalPorts}</p>
        </div>
      </div>

      {/* Open Ports */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 shadow-md flex items-center space-x-3.5">
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Open Ports</p>
          <p className="text-xl font-extrabold text-emerald-400 font-mono mt-0.5">{openPorts}</p>
        </div>
      </div>

      {/* Closed Ports */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 shadow-md flex items-center space-x-3.5">
        <div className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Closed Ports</p>
          <p className="text-xl font-extrabold text-slate-300 font-mono mt-0.5">{closedPorts}</p>
        </div>
      </div>

      {/* Duration */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 shadow-md flex items-center space-x-3.5">
        <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-cyan-400">
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Duration</p>
          <p className="text-xl font-extrabold text-cyan-300 font-mono mt-0.5">{duration.toFixed(2)}s</p>
        </div>
      </div>

      {/* Host Status */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-4 shadow-md flex items-center space-x-3.5">
        <div className={`p-3 rounded-xl border ${
          isReachable 
            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
            : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
        }`}>
          <Server className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Host Status</p>
          <p className={`text-base font-extrabold font-mono mt-0.5 ${isReachable ? 'text-emerald-400' : 'text-amber-400'}`}>
            {isReachable ? 'Reachable' : 'Unreachable'}
          </p>
        </div>
      </div>
    </div>
  );
}

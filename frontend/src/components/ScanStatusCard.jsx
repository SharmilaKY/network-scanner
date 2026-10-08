import React from 'react';
import { Activity, CheckCircle2, XCircle, Clock, Zap, Target, ShieldCheck, Square } from 'lucide-react';

export default function ScanStatusCard({ scanStatus, onCancelScan }) {
  if (!scanStatus) return null;

  const {
    target,
    resolved_ip,
    reachable,
    status,
    progress = 0,
    scanned_ports = 0,
    total_ports = 0,
    open_ports_count = 0,
    duration = 0,
    threads = 50,
    message = ''
  } = scanStatus;

  const isCompleted = status === 'completed';
  const isCancelled = status === 'cancelled';
  const isFailed = status === 'failed';
  const isRunning = status === 'running' || status === 'resolving' || status === 'pinging';

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2.5 rounded-xl border ${
            isRunning 
              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-400 animate-pulse' 
              : isCompleted
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
          }`}>
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Target Probe:</span>
              <span className="text-sm font-bold text-white font-mono">{target}</span>
              {resolved_ip && resolved_ip !== target && (
                <span className="text-xs text-cyan-400 font-mono">({resolved_ip})</span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{message || 'Scan active...'}</p>
          </div>
        </div>

        {/* Status Pill & Cancel Button */}
        <div className="flex items-center gap-3">
          {/* Host Reachability Badge */}
          <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
            reachable === true
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
              : reachable === false
              ? 'bg-amber-950/80 border-amber-800 text-amber-300'
              : 'bg-slate-900 border-slate-700 text-slate-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${
              reachable === true ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-amber-400'
            }`}></span>
            <span>{reachable === true ? 'Reachable' : 'No Ping Response'}</span>
          </div>

          {/* Execution Status Badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wide border ${
            isRunning
              ? 'bg-cyan-950/80 border-cyan-800 text-cyan-300'
              : isCompleted
              ? 'bg-emerald-950/80 border-emerald-800 text-emerald-300'
              : 'bg-slate-800 border-slate-700 text-slate-300'
          }`}>
            {status}
          </div>

          {isRunning && onCancelScan && (
            <button
              onClick={() => onCancelScan(scanStatus.scan_id)}
              className="flex items-center gap-1 px-3 py-1 rounded-lg border border-rose-800/80 bg-rose-950/70 hover:bg-rose-900 text-rose-300 text-xs font-semibold transition"
            >
              <Square className="w-3 h-3 fill-current" />
              <span>Cancel</span>
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar Container */}
      <div>
        <div className="flex items-center justify-between text-xs font-mono mb-2">
          <span className="text-slate-400">Scan Progress</span>
          <span className="text-cyan-400 font-bold">{progress.toFixed(1)}%</span>
        </div>
        <div className="w-full h-3 bg-slate-900 border border-slate-800 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isCompleted
                ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]'
                : 'bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)]'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          ></div>
        </div>
      </div>

      {/* Real-time Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
        <div className="bg-[#0b0f19] border border-slate-800/80 rounded-xl p-3.5">
          <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
            <Target className="w-3.5 h-3.5 text-cyan-400" />
            <span>Ports Scanned</span>
          </div>
          <p className="text-lg font-bold text-white font-mono">
            {scanned_ports} <span className="text-xs text-slate-500 font-normal">/ {total_ports}</span>
          </p>
        </div>

        <div className="bg-[#0b0f19] border border-slate-800/80 rounded-xl p-3.5">
          <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Open Ports</span>
          </div>
          <p className={`text-lg font-bold font-mono ${open_ports_count > 0 ? 'text-emerald-400' : 'text-slate-300'}`}>
            {open_ports_count}
          </p>
        </div>

        <div className="bg-[#0b0f19] border border-slate-800/80 rounded-xl p-3.5">
          <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>Duration</span>
          </div>
          <p className="text-lg font-bold text-white font-mono">
            {duration.toFixed(2)} <span className="text-xs text-slate-500 font-normal">sec</span>
          </p>
        </div>

        <div className="bg-[#0b0f19] border border-slate-800/80 rounded-xl p-3.5">
          <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Threads</span>
          </div>
          <p className="text-lg font-bold text-white font-mono">
            {threads}
          </p>
        </div>
      </div>
    </div>
  );
}

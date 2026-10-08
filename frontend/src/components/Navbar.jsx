import React from 'react';
import { Shield, Activity, Wifi, WifiOff, Settings } from 'lucide-react';

export default function Navbar({ isBackendOnline }) {
  return (
    <header className="sticky top-0 z-30 bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 px-4 lg:px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Brand Header */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-wide flex items-center gap-2">
              NETSCAN <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-mono border border-cyan-500/30">PRO v1.0</span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Network Ping & TCP Port Reconnaissance</p>
          </div>
        </div>

        {/* Status Badge & Controls */}
        <div className="flex items-center space-x-4">
          <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border text-xs font-mono transition-all duration-300 ${
            isBackendOnline 
              ? 'bg-emerald-950/60 border-emerald-800/80 text-emerald-400' 
              : 'bg-rose-950/60 border-rose-800/80 text-rose-400'
          }`}>
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                isBackendOnline ? 'bg-emerald-400' : 'bg-rose-400'
              }`}></span>
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                isBackendOnline ? 'bg-emerald-500' : 'bg-rose-500'
              }`}></span>
            </span>
            <span className="font-semibold">{isBackendOnline ? 'BACKEND ONLINE' : 'BACKEND DISCONNECTED'}</span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 font-mono border border-slate-800 px-3 py-1.5 rounded-lg bg-slate-900/60">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>TCP/IP Socket Engine</span>
          </div>
        </div>
      </div>
    </header>
  );
}

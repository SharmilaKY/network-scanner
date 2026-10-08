import React, { useState } from 'react';
import { Play, RotateCcw, Cpu, Globe, Sliders, AlertCircle } from 'lucide-react';

export default function ScannerForm({ onStartScan, isScanning, onClear }) {
  const [host, setHost] = useState('127.0.0.1');
  const [ports, setPorts] = useState('8000-8100');
  const [threads, setThreads] = useState(50);
  const [validationError, setValidationError] = useState('');

  const handlePreset = (presetRange) => {
    setPorts(presetRange);
    setValidationError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    const targetHost = host.trim();
    const portRange = ports.trim();

    if (!targetHost) {
      setValidationError('Target host or IP address cannot be empty.');
      return;
    }

    if (!portRange) {
      setValidationError('Port or port range cannot be empty.');
      return;
    }

    // Basic port format validation
    if (portRange.includes('-')) {
      const parts = portRange.split('-');
      if (parts.length !== 2) {
        setValidationError('Invalid port range format. Use start-end (e.g., 8000-8100).');
        return;
      }
      const start = parseInt(parts[0].strip ? parts[0].strip() : parts[0], 10);
      const end = parseInt(parts[1].strip ? parts[1].strip() : parts[1], 10);
      if (isNaN(start) || isNaN(end) || start < 1 || end > 65535 || start > end) {
        setValidationError('Invalid range. Ports must be between 1 and 65535, with start <= end.');
        return;
      }
    } else {
      const single = parseInt(portRange, 10);
      if (isNaN(single) || single < 1 || single > 65535) {
        setValidationError('Invalid port number. Must be an integer between 1 and 65535.');
        return;
      }
    }

    onStartScan({ host: targetHost, ports: portRange, threads: parseInt(threads, 10) });
  };

  const handleReset = () => {
    setHost('127.0.0.1');
    setPorts('8000-8100');
    setThreads(50);
    setValidationError('');
    if (onClear) onClear();
  };

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Decorative gradient border effect */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"></div>

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Sliders className="w-5 h-5 text-cyan-400" />
          <span>Scanner Configuration</span>
        </h2>
        <span className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-md">
          TCP Port Probe
        </span>
      </div>

      {validationError && (
        <div className="mb-4 p-3 bg-rose-950/70 border border-rose-800/80 rounded-xl text-xs text-rose-300 flex items-start gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
          <span>{validationError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Target Host */}
          <div className="lg:col-span-1">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Target Host / IP
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <input
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="e.g., 127.0.0.1 or localhost"
                disabled={isScanning}
                className="w-full bg-[#0b0f19] border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono disabled:opacity-50"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Hostname or IPv4 target address</p>
          </div>

          {/* Port Range & Presets */}
          <div className="lg:col-span-1">
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Port Range
              </label>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handlePreset('20-1024')}
                  disabled={isScanning}
                  className="text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-cyan-300 px-1.5 py-0.5 rounded border border-slate-700 transition"
                >
                  20-1024
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset('8000-8100')}
                  disabled={isScanning}
                  className="text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-cyan-300 px-1.5 py-0.5 rounded border border-slate-700 transition"
                >
                  8000-8100
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset('80,443,8080')}
                  disabled={isScanning}
                  className="text-[10px] font-mono bg-slate-800 hover:bg-slate-700 text-cyan-300 px-1.5 py-0.5 rounded border border-slate-700 transition"
                >
                  HTTP
                </button>
              </div>
            </div>
            <input
              type="text"
              value={ports}
              onChange={(e) => setPorts(e.target.value)}
              placeholder="e.g., 8000-8100 or 8080"
              disabled={isScanning}
              className="w-full bg-[#0b0f19] border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono disabled:opacity-50"
            />
            <p className="text-[11px] text-slate-500 mt-1">Single port (80) or range (8000-8100)</p>
          </div>

          {/* Threads Selector */}
          <div className="lg:col-span-1">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">
              Concurrent Threads
            </label>
            <div className="relative">
              <Cpu className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
              <select
                value={threads}
                onChange={(e) => setThreads(parseInt(e.target.value, 10))}
                disabled={isScanning}
                className="w-full bg-[#0b0f19] border border-slate-700/80 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all font-mono disabled:opacity-50 appearance-none"
              >
                <option value={10}>10 Threads (Low Impact)</option>
                <option value={25}>25 Threads (Balanced)</option>
                <option value={50}>50 Threads (Recommended)</option>
                <option value={100}>100 Threads (High Speed)</option>
                <option value={200}>200 Threads (Maximum Speed)</option>
              </select>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">ThreadPoolExecutor concurrency limit</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={isScanning}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-sm font-medium transition disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Clear</span>
          </button>

          <button
            type="submit"
            disabled={isScanning}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm transition shadow-lg ${
              isScanning
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-cyan-500/25 hover:shadow-cyan-500/40 border border-cyan-400/30'
            }`}
          >
            {isScanning ? (
              <>
                <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span>
                <span>Scan Running...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Scan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

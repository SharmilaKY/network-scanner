import React, { useState, useEffect } from 'react';
import { History, Search, ExternalLink, Calendar, Clock, ShieldCheck, RefreshCw } from 'lucide-react';
import { fetchScanHistory } from '../services/api';

export default function HistoryPage({ onViewScanDetail }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await fetchScanHistory();
      setHistory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const filteredHistory = history.filter(
    (item) =>
      item.target.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.scan_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.resolved_ip && item.resolved_ip.includes(searchTerm))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <span>Scan History Log</span>
          </h2>
          <p className="text-xs text-slate-400">Review previous diagnostic scans executed during this session.</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={loadHistory}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search history..."
              className="bg-[#0b0f19] border border-slate-700 rounded-xl pl-9 pr-3.5 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono w-48 sm:w-60"
            />
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#0b0f19] text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800 font-mono">
              <tr>
                <th className="px-4 py-3">Scan ID</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">Resolved IP</th>
                <th className="px-4 py-3">Port Range</th>
                <th className="px-4 py-3">Open Ports</th>
                <th className="px-4 py-3">Duration</th>
                <th className="px-4 py-3">Date / Time</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                    Loading scan history...
                  </td>
                </tr>
              ) : filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-slate-500">
                    No scan history records found.
                  </td>
                </tr>
              ) : (
                filteredHistory.map((item) => (
                  <tr
                    key={item.scan_id}
                    onClick={() => onViewScanDetail(item.scan_id)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-400 truncate max-w-[120px]" title={item.scan_id}>
                      {item.scan_id}
                    </td>
                    <td className="px-4 py-3 font-bold text-white">
                      {item.target}
                    </td>
                    <td className="px-4 py-3 text-cyan-400">
                      {item.resolved_ip || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-slate-300">
                      {item.port_range}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`font-bold ${item.open_ports_count > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                        {item.open_ports_count} open
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {item.duration ? item.duration.toFixed(2) : '0.00'}s
                    </td>
                    <td className="px-4 py-3 text-slate-400 font-sans text-[11px]">
                      {new Date(item.start_time).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                        item.status === 'completed'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewScanDetail(item.scan_id);
                        }}
                        className="inline-flex items-center gap-1 text-cyan-400 hover:text-cyan-300 text-xs font-sans font-semibold"
                      >
                        <span>View</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

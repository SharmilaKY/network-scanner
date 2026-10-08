import React, { useState } from 'react';
import { Search, Filter, Download, ArrowUpDown, Info, FileJson, FileText, CheckCircle2, Circle } from 'lucide-react';
import { getReportDownloadUrl } from '../services/api';

export default function ResultsTable({ scanStatus, onSelectPort }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [openOnly, setOpenOnly] = useState(true);
  const [sortAsc, setSortAsc] = useState(true);

  if (!scanStatus) return null;

  const { scan_id, start_port = 1, end_port = 100, results = [], status } = scanStatus;

  // Build complete port list if scan is completed and openOnly is false
  let displayPorts = [];

  if (openOnly) {
    displayPorts = [...results];
  } else {
    // Merge open ports with closed ports
    const openMap = new Map();
    results.forEach((item) => openMap.set(item.port, item));

    const totalRange = Math.min(200, end_port - start_port + 1); // limit total rows rendered if wide range
    for (let p = start_port; p < start_port + totalRange; p++) {
      if (openMap.has(p)) {
        displayPorts.push(openMap.get(p));
      } else {
        displayPorts.push({
          port: p,
          status: 'CLOSED',
          service: 'Closed Port',
          protocol: 'TCP'
        });
      }
    }
  }

  // Filter by search
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    displayPorts = displayPorts.filter(
      (item) =>
        item.port.toString().includes(term) ||
        (item.service && item.service.toLowerCase().includes(term))
    );
  }

  // Sort
  displayPorts.sort((a, b) => (sortAsc ? a.port - b.port : b.port - a.port));

  const isCompleted = status === 'completed';

  return (
    <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
      {/* Table Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>Scan Results Table</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 font-mono border border-slate-700">
              {results.length} Open
            </span>
          </h3>
        </div>

        {/* Search, Filter & Report Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search port/service..."
              className="bg-[#0b0f19] border border-slate-700/80 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono w-44 sm:w-56"
            />
          </div>

          {/* Open Only Toggle */}
          <button
            onClick={() => setOpenOnly(!openOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition ${
              openOnly
                ? 'bg-cyan-950/80 border-cyan-800 text-cyan-300'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{openOnly ? 'Open Ports Only' : 'All Ports'}</span>
          </button>

          {/* Sort Button */}
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 hover:text-white text-xs font-semibold transition"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortAsc ? 'Port ↑' : 'Port ↓'}</span>
          </button>

          {/* Report Download Action Buttons */}
          {isCompleted && scan_id && (
            <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
              <a
                href={getReportDownloadUrl(scan_id, 'json')}
                download={`scan_report_${scan_id}.json`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition shadow-sm"
                title="Download JSON Report"
              >
                <FileJson className="w-3.5 h-3.5 text-cyan-400" />
                <span>JSON</span>
              </a>

              <a
                href={getReportDownloadUrl(scan_id, 'txt')}
                download={`scan_report_${scan_id}.txt`}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition"
                title="Download TXT Report"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>TXT</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#0b0f19] text-xs font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-800">
            <tr>
              <th className="px-4 py-3 font-mono">Port</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Service</th>
              <th className="px-4 py-3">Protocol</th>
              <th className="px-4 py-3 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
            {displayPorts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                  {status === 'running'
                    ? 'Scanning for open TCP ports...'
                    : 'No matching open ports found.'}
                </td>
              </tr>
            ) : (
              displayPorts.map((row) => {
                const isOpen = row.status === 'OPEN';
                return (
                  <tr
                    key={row.port}
                    onClick={() => onSelectPort && onSelectPort(row)}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="px-4 py-3 text-cyan-400 font-bold font-mono">
                      {row.port}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold text-[11px] ${
                        isOpen 
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}>
                        {isOpen ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#34d399]"></span>
                            <span>OPEN</span>
                          </>
                        ) : (
                          <>
                            <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                            <span>CLOSED</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-200 font-sans font-medium">
                      {row.service || 'Unknown'}
                    </td>
                    <td className="px-4 py-3 text-slate-400">
                      {row.protocol || 'TCP'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="p-1 rounded bg-slate-800 text-slate-400 hover:text-cyan-400 transition">
                        <Info className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

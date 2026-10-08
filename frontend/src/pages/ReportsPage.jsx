import React, { useState, useEffect } from 'react';
import { FileText, Download, Eye, FileJson, Calendar, Target, ShieldCheck, Clock } from 'lucide-react';
import { fetchScanHistory, getReportDownloadUrl } from '../services/api';
import ReportPreviewModal from '../components/ReportPreviewModal';

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewInfo, setPreviewInfo] = useState({ open: false, scanId: null, format: 'json' });

  const loadReports = async () => {
    setLoading(true);
    try {
      const data = await fetchScanHistory();
      setReports(data.filter((item) => item.status === 'completed'));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <span>Diagnostic Reports Center</span>
        </h2>
        <p className="text-xs text-slate-400">Generate, view, and export formatted JSON and plain text diagnostic scan reports.</p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full py-12 text-center text-slate-500 font-mono">
            Loading generated reports...
          </div>
        ) : reports.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 font-mono bg-[#111827] border border-slate-800 rounded-2xl p-8">
            No completed scan reports available. Run a port scan from the Dashboard to generate reports.
          </div>
        ) : (
          reports.map((item) => (
            <div
              key={item.scan_id}
              className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4 hover:border-slate-700 transition"
            >
              {/* Card Title */}
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 rounded-lg text-cyan-400">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-mono">{item.target}</h4>
                    <p className="text-[11px] text-slate-400 font-mono">{item.resolved_ip}</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono bg-slate-900 text-cyan-300 px-2 py-0.5 rounded border border-slate-800">
                  {item.port_range}
                </span>
              </div>

              {/* Metrics row */}
              <div className="grid grid-cols-3 gap-2 font-mono text-xs text-slate-300">
                <div className="bg-[#0b0f19] p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block uppercase">Open Ports</span>
                  <span className="font-bold text-emerald-400">{item.open_ports_count}</span>
                </div>
                <div className="bg-[#0b0f19] p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block uppercase">Scanned</span>
                  <span className="font-bold text-white">{item.total_ports}</span>
                </div>
                <div className="bg-[#0b0f19] p-2.5 rounded-xl border border-slate-800/80">
                  <span className="text-[10px] text-slate-500 block uppercase">Duration</span>
                  <span className="font-bold text-cyan-300">{item.duration ? item.duration.toFixed(2) : 0}s</span>
                </div>
              </div>

              {/* Scan Time */}
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>{new Date(item.start_time).toLocaleString()}</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => setPreviewInfo({ open: true, scanId: item.scan_id, format: 'json' })}
                  className="flex items-center justify-center gap-1 py-2 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition"
                >
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  <span>View</span>
                </button>

                <a
                  href={getReportDownloadUrl(item.scan_id, 'json')}
                  download={`scan_report_${item.scan_id}.json`}
                  className="flex items-center justify-center gap-1 py-2 px-2 bg-cyan-950/80 hover:bg-cyan-900 text-cyan-300 text-xs font-semibold rounded-xl border border-cyan-800/80 transition"
                >
                  <FileJson className="w-3.5 h-3.5 text-cyan-400" />
                  <span>JSON</span>
                </a>

                <a
                  href={getReportDownloadUrl(item.scan_id, 'txt')}
                  download={`scan_report_${item.scan_id}.txt`}
                  className="flex items-center justify-center gap-1 py-2 px-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>TXT</span>
                </a>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Preview Modal */}
      {previewInfo.open && (
        <ReportPreviewModal
          scanId={previewInfo.scanId}
          format={previewInfo.format}
          onClose={() => setPreviewInfo({ open: false, scanId: null, format: 'json' })}
        />
      )}
    </div>
  );
}

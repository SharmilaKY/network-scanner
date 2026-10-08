import React, { useState, useEffect } from 'react';
import { X, FileJson, FileText, Copy, Check, Download } from 'lucide-react';
import { getReportDownloadUrl } from '../services/api';

export default function ReportPreviewModal({ scanId, format, onClose }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!scanId) return;
    setLoading(true);
    const url = getReportDownloadUrl(scanId, format);
    fetch(url)
      .then((res) => res.text())
      .then((data) => {
        setContent(data);
        setLoading(false);
      })
      .catch((err) => {
        setContent('Error loading report file content.');
        setLoading(false);
      });
  }, [scanId, format]);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!scanId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111827] border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative space-y-4 max-h-[85vh] flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-3">
          <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            {format === 'json' ? <FileJson className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider font-mono">
              Scan Report Preview ({format.toUpperCase()})
            </h3>
            <p className="text-xs text-slate-400 font-mono">ID: {scanId}</p>
          </div>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 overflow-auto bg-[#0b0f19] border border-slate-800 rounded-xl p-4 font-mono text-xs text-cyan-300 leading-relaxed">
          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading report data...</div>
          ) : (
            <pre className="whitespace-pre-wrap">{content}</pre>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Report'}</span>
          </button>

          <div className="flex items-center space-x-2">
            <a
              href={getReportDownloadUrl(scanId, format)}
              download={`scan_report_${scanId}.${format}`}
              className="flex items-center gap-1.5 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-xl transition shadow-md"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { X, Server, ShieldCheck, Cpu, CheckCircle } from 'lucide-react';

export default function ServiceDetailModal({ portData, onClose }) {
  if (!portData) return null;

  const { port, service, protocol = 'TCP', status = 'OPEN' } = portData;

  const serviceDescriptions = {
    'FTP': 'File Transfer Protocol for transferring files between host and server.',
    'FTP-Data': 'File Transfer Protocol Data channel.',
    'SSH': 'Secure Shell protocol for secure remote access and encrypted terminal sessions.',
    'Telnet': 'Unencrypted text communications protocol.',
    'SMTP': 'Simple Mail Transfer Protocol for sending email messages.',
    'DNS': 'Domain Name System for hostname to IP resolution.',
    'HTTP': 'Hypertext Transfer Protocol for web server communication.',
    'POP3': 'Post Office Protocol version 3 for retrieving emails.',
    'IMAP': 'Internet Message Access Protocol for mail retrieval and synchronization.',
    'HTTPS': 'HTTP Secure over TLS/SSL encryption for web services.',
    'MySQL': 'MySQL relational database management system service.',
    'RDP': 'Remote Desktop Protocol for GUI remote administration on Windows.',
    'PostgreSQL': 'PostgreSQL object-relational database server.',
    'Redis': 'In-memory key-value data structure store.',
    'HTTP-Alt': 'Alternate HTTP port commonly used for proxy servers and web applications.'
  };

  const desc = serviceDescriptions[service] || 'Standard TCP port service endpoint.';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#111827] border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-4">
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span>Port {port} Details</span>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-mono border border-emerald-800">
                {status}
              </span>
            </h3>
            <p className="text-xs text-slate-400 font-mono">{protocol} Protocol Service</p>
          </div>
        </div>

        {/* Detail Items */}
        <div className="space-y-3 font-mono text-xs">
          <div className="bg-[#0b0f19] p-3 rounded-xl border border-slate-800 flex justify-between items-center">
            <span className="text-slate-400">Port Number:</span>
            <span className="text-cyan-400 font-bold text-sm">{port}</span>
          </div>

          <div className="bg-[#0b0f19] p-3 rounded-xl border border-slate-800 flex justify-between items-center">
            <span className="text-slate-400">Detected Service:</span>
            <span className="text-white font-bold text-sm font-sans">{service}</span>
          </div>

          <div className="bg-[#0b0f19] p-3 rounded-xl border border-slate-800 flex justify-between items-center">
            <span className="text-slate-400">Transport Layer:</span>
            <span className="text-slate-300 font-bold">{protocol}</span>
          </div>

          <div className="bg-[#0b0f19] p-3 rounded-xl border border-slate-800 space-y-1 font-sans">
            <span className="text-slate-400 text-[11px] block font-mono">Service Description:</span>
            <p className="text-slate-300 text-xs leading-relaxed">{desc}</p>
          </div>
        </div>

        {/* Disclaimer Note */}
        <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl text-[11px] text-slate-400 font-sans leading-snug">
          <span className="text-cyan-400 font-semibold">Note:</span> Detected Service identification is based on standard socket IANA common port mappings without deep application banner grabbing.
        </div>

        {/* Close Action */}
        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
}

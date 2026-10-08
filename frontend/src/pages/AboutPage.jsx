import React from 'react';
import { Shield, Code, Cpu, Server, Terminal, Lock, CheckCircle2, FileCheck, Layers } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono">
              <Shield className="w-3.5 h-3.5" />
              <span>Full-Stack Cybersecurity & Networking Tool</span>
            </div>
            <h2 className="text-2xl font-extrabold text-white tracking-tight">
              Network Ping & TCP Port Scanner
            </h2>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              A high-performance full-stack web application designed for authorized network reconnaissance, host reachability checks, and TCP port analysis. Built by integrating existing Python socket scanning logic with a FastAPI REST backend and a modern React dashboard.
            </p>
          </div>

          <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-1.5 flex-shrink-0">
            <div className="text-slate-500 text-[10px] uppercase font-bold">Project Metadata</div>
            <div>Architecture: <span className="text-cyan-400">FastAPI + React</span></div>
            <div>Threading: <span className="text-cyan-400">ThreadPoolExecutor</span></div>
            <div>Protocol: <span className="text-cyan-400">TCP / IP Sockets</span></div>
            <div>Testing: <span className="text-emerald-400">Pytest Verified</span></div>
          </div>
        </div>
      </div>

      {/* Capabilities & Tech Stack */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Key Capabilities */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Layers className="w-5 h-5 text-cyan-400" />
            <span>Key System Capabilities</span>
          </h3>

          <ul className="space-y-3 text-xs text-slate-300 font-sans">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong className="text-white">Hostname & IP Resolution:</strong> Automatically resolves hostnames (e.g., <code className="text-cyan-300 font-mono">localhost</code>) to IPv4 addresses using <code className="text-cyan-300 font-mono">socket.gethostbyname()</code>.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong className="text-white">ICMP Ping Reachability:</strong> Cross-platform ICMP reachability checks (<code className="text-cyan-300 font-mono">ping -n 1</code> on Windows / <code className="text-cyan-300 font-mono">ping -c 1</code> on Linux).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong className="text-white">Multithreaded TCP Port Scanning:</strong> Concurrent port status probing using Python's <code className="text-cyan-300 font-mono">ThreadPoolExecutor</code> with configurable thread limits (1-500).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong className="text-white">Service Identification:</strong> Maps open TCP ports to standard IANA network services (FTP, SSH, HTTP, HTTPS, MySQL, RDP, Redis, PostgreSQL).</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong className="text-white">Real-Time Scan Progress:</strong> Asynchronous progress tracking with live progress percentage, port statistics, and duration timer.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span><strong className="text-white">Report Generation & Export:</strong> Automatic generation of structured JSON and human-readable TXT scan reports.</span>
            </li>
          </ul>
        </div>

        {/* Technology Stack */}
        <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Code className="w-5 h-5 text-cyan-400" />
            <span>Technology Stack</span>
          </h3>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Backend Framework</span>
              <p className="text-white font-sans font-semibold">Python 3.12+ / FastAPI / Uvicorn</p>
              <p className="text-slate-400 font-sans text-[11px]">Asynchronous REST endpoints, Pydantic data validation, CORS middleware.</p>
            </div>

            <div className="p-3 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Frontend Framework</span>
              <p className="text-white font-sans font-semibold">React 18 / Vite / Tailwind CSS / Lucide React</p>
              <p className="text-slate-400 font-sans text-[11px]">Cybersecurity dark theme dashboard with dynamic responsiveness and polling engine.</p>
            </div>

            <div className="p-3 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">Containerization & Tests</span>
              <p className="text-white font-sans font-semibold">Docker / Docker Compose / Pytest</p>
              <p className="text-slate-400 font-sans text-[11px]">Containerized multi-stage deployments & comprehensive automated test suites.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Responsible Use & Legal Notice */}
      <div className="bg-gradient-to-r from-amber-950/40 via-rose-950/20 to-slate-900 border border-amber-800/60 rounded-2xl p-6 shadow-lg space-y-3">
        <div className="flex items-center space-x-2 text-amber-400 font-bold text-sm">
          <Lock className="w-5 h-5" />
          <span>Responsible Use & Authorized Testing Disclaimer</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          This network scanning application is intended <strong>ONLY</strong> for educational purposes, local diagnostic testing (<code className="text-amber-300 font-mono">127.0.0.1</code> / <code className="text-amber-300 font-mono">localhost</code>), systems owned by the operator, or target networks for which explicit written authorization has been granted. Unauthorized port scanning against external third-party systems or public IP addresses without consent may violate computer security laws and institutional policies.
        </p>
      </div>

      {/* Viva / Placement Interview Guide */}
      <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-lg space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
          <Terminal className="w-5 h-5 text-cyan-400" />
          <span>Project Viva & Interview Architecture Explanation</span>
        </h3>

        <div className="space-y-4 text-xs text-slate-300 font-sans leading-relaxed">
          <div>
            <h4 className="font-bold text-white text-sm mb-1">1. How does the TCP scanning engine work?</h4>
            <p className="text-slate-400">
              The core scanner creates standard TCP stream sockets using <code className="text-cyan-300 font-mono">socket.socket(socket.AF_INET, socket.SOCK_STREAM)</code> with a strict timeout (<code className="text-cyan-300 font-mono">0.5s</code>). It executes <code className="text-cyan-300 font-mono">connect_ex((ip, port))</code>. A return code of <code className="text-cyan-300 font-mono">0</code> indicates the 3-way TCP handshake succeeded (port is OPEN), while non-zero return codes signify connection failure or port closure.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-1">2. How is concurrency handled without blocking the Web API?</h4>
            <p className="text-slate-400">
              When a user submits a scan request via <code className="text-cyan-300 font-mono">POST /api/scan</code>, FastAPI validates the request and launches a dedicated background worker thread executing Python's <code className="text-cyan-300 font-mono">ThreadPoolExecutor(max_workers=threads)</code>. As futures complete, progress percentages and open port results are updated in memory atomically. The frontend continuously polls <code className="text-cyan-300 font-mono">GET /api/scan/&#123;scan_id&#125;</code> to update the UI progress bar seamlessly.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white text-sm mb-1">3. How are existing CLI capabilities reused?</h4>
            <p className="text-slate-400">
              The project preserves <code className="text-cyan-300 font-mono">scanner.py</code> at the root directory. The FastAPI backend service layer (<code className="text-cyan-300 font-mono">scanner_service.py</code>) directly imports and invokes <code className="text-cyan-300 font-mono">scanner.resolve_host()</code>, <code className="text-cyan-300 font-mono">scanner.ping_host()</code>, <code className="text-cyan-300 font-mono">scanner.parse_ports()</code>, <code className="text-cyan-300 font-mono">scanner.scan_port()</code>, and <code className="text-cyan-300 font-mono">scanner.get_service_name()</code>, eliminating duplicate code while enabling web access.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

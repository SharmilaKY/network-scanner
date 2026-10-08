import React from 'react';
import { LayoutDashboard, Radar, History, FileText, Info, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, collapsed, setCollapsed }) {
  const navItems = [
    { id: 'scanner', label: 'Scanner', icon: Radar },
    { id: 'history', label: 'Scan History', icon: History },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'about', label: 'About', icon: Info },
  ];

  return (
    <aside className={`relative flex flex-col bg-[#0f172a] border-r border-slate-800 transition-all duration-300 z-20 ${
      collapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Toggle Button */}
      <button 
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-full p-1 shadow-md transition-colors"
        title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {/* Nav List */}
      <nav className="flex-1 p-3 space-y-1.5 mt-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-600/10 text-cyan-400 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)] font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Sidebar Footer info */}
      {!collapsed && (
        <div className="p-4 m-3 rounded-xl bg-slate-900/80 border border-slate-800/80 text-xs text-slate-400">
          <p className="font-semibold text-slate-300">Authorized Use Only</p>
          <p className="text-[11px] mt-1 text-slate-500 leading-tight">
            Perform diagnostic scans only on localhost or explicitly owned systems.
          </p>
        </div>
      )}
    </aside>
  );
}

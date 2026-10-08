import React from 'react';
import ScannerForm from '../components/ScannerForm';
import ScanStatusCard from '../components/ScanStatusCard';
import SummaryCards from '../components/SummaryCards';
import ResultsTable from '../components/ResultsTable';

export default function DashboardPage({
  scanStatus,
  isScanning,
  onStartScan,
  onCancelScan,
  onClearScan,
  onSelectPort
}) {
  return (
    <div className="space-y-6">
      {/* Page Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-wide">Network Scanner Dashboard</h2>
          <p className="text-xs text-slate-400">Configure target parameters, run TCP port analysis, and monitor live status.</p>
        </div>
      </div>

      {/* Scanner Form Input */}
      <ScannerForm
        onStartScan={onStartScan}
        isScanning={isScanning}
        onClear={onClearScan}
      />

      {/* Active or Completed Scan Status Card */}
      {scanStatus && (
        <ScanStatusCard
          scanStatus={scanStatus}
          onCancelScan={onCancelScan}
        />
      )}

      {/* Post-scan Summary Cards */}
      {scanStatus && scanStatus.status === 'completed' && (
        <SummaryCards scanStatus={scanStatus} />
      )}

      {/* Interactive Results Table */}
      {scanStatus && (
        <ResultsTable
          scanStatus={scanStatus}
          onSelectPort={onSelectPort}
        />
      )}
    </div>
  );
}

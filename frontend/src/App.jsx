import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import HistoryPage from './pages/HistoryPage';
import ReportsPage from './pages/ReportsPage';
import AboutPage from './pages/AboutPage';
import ServiceDetailModal from './components/ServiceDetailModal';
import {
  checkBackendHealth,
  startScan,
  getScanStatus,
  cancelScan,
  fetchScanHistoryDetail
} from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('scanner');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isBackendOnline, setIsBackendOnline] = useState(true);

  // Active scan state
  const [activeScanId, setActiveScanId] = useState(null);
  const [scanStatus, setScanStatus] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedPortData, setSelectedPortData] = useState(null);
  const [notification, setNotification] = useState(null);

  // Check backend health periodically
  useEffect(() => {
    const checkHealth = async () => {
      const online = await checkBackendHealth();
      setIsBackendOnline(online);
    };
    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  // Poll scan status when a scan is active
  useEffect(() => {
    let pollInterval = null;

    if (isScanning && activeScanId) {
      pollInterval = setInterval(async () => {
        try {
          const data = await getScanStatus(activeScanId);
          setScanStatus(data);

          if (['completed', 'failed', 'cancelled'].includes(data.status)) {
            setIsScanning(false);
            if (data.status === 'completed') {
              showNotification('Scan completed successfully!', 'success');
            } else if (data.status === 'cancelled') {
              showNotification('Scan was cancelled.', 'info');
            } else if (data.status === 'failed') {
              showNotification(data.message || 'Scan failed.', 'error');
            }
          }
        } catch (err) {
          console.error('Polling error:', err);
        }
      }, 400); // 400ms polling for smooth progress updates
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [isScanning, activeScanId]);

  const showNotification = (msg, type = 'info') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Start new scan
  const handleStartScan = async ({ host, ports, threads }) => {
    try {
      setScanStatus(null);
      const initialData = await startScan({ host, ports, threads });
      setActiveScanId(initialData.scan_id);
      setScanStatus(initialData);
      setIsScanning(true);
      showNotification(`Scan initiated for ${host} (${ports})...`, 'info');
    } catch (err) {
      showNotification(err.message || 'Failed to start scan.', 'error');
    }
  };

  // Cancel running scan
  const handleCancelScan = async (scanId) => {
    try {
      await cancelScan(scanId);
      showNotification('Cancellation requested...', 'info');
    } catch (err) {
      showNotification(err.message || 'Could not cancel scan.', 'error');
    }
  };

  // Clear current dashboard scan
  const handleClearScan = () => {
    if (!isScanning) {
      setScanStatus(null);
      setActiveScanId(null);
      showNotification('Dashboard reset.', 'info');
    }
  };

  // View historical scan on dashboard
  const handleViewHistoricalScan = async (scanId) => {
    try {
      const data = await fetchScanHistoryDetail(scanId);
      setActiveScanId(scanId);
      setScanStatus(data);
      setActiveTab('scanner');
      showNotification(`Loaded scan report ${scanId}`, 'info');
    } catch (err) {
      showNotification(err.message || 'Failed to load scan details.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans">
      {/* Navbar Header */}
      <Navbar isBackendOnline={isBackendOnline} />

      {/* Notification Toast */}
      {notification && (
        <div className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-xl border shadow-2xl text-xs font-semibold flex items-center gap-2 animate-bounce ${
          notification.type === 'error'
            ? 'bg-rose-950 border-rose-800 text-rose-300'
            : notification.type === 'success'
            ? 'bg-emerald-950 border-emerald-800 text-emerald-300'
            : 'bg-cyan-950 border-cyan-800 text-cyan-300'
        }`}>
          <span>{notification.msg}</span>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {activeTab === 'scanner' && (
            <DashboardPage
              scanStatus={scanStatus}
              isScanning={isScanning}
              onStartScan={handleStartScan}
              onCancelScan={handleCancelScan}
              onClearScan={handleClearScan}
              onSelectPort={(portData) => setSelectedPortData(portData)}
            />
          )}

          {activeTab === 'history' && (
            <HistoryPage onViewScanDetail={handleViewHistoricalScan} />
          )}

          {activeTab === 'reports' && (
            <ReportsPage />
          )}

          {activeTab === 'about' && (
            <AboutPage />
          )}
        </main>
      </div>

      {/* Service Detail Modal */}
      {selectedPortData && (
        <ServiceDetailModal
          portData={selectedPortData}
          onClose={() => setSelectedPortData(null)}
        />
      )}
    </div>
  );
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`, { method: 'GET' });
    if (!response.ok) return false;
    const data = await response.json();
    return data.status === 'healthy';
  } catch (error) {
    return false;
  }
}

export async function resolveHost(host) {
  const response = await fetch(`${API_BASE_URL}/api/resolve`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ host }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || data.detail || 'Failed to resolve host');
  }
  return data;
}

export async function pingHost(host) {
  const response = await fetch(`${API_BASE_URL}/api/ping`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ host }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || 'Ping request failed');
  }
  return data;
}

export async function startScan({ host, ports, threads }) {
  const response = await fetch(`${API_BASE_URL}/api/scan`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ host, ports, threads: parseInt(threads, 10) }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || data.error || 'Failed to initiate scan');
  }
  return data;
}

export async function getScanStatus(scanId) {
  const response = await fetch(`${API_BASE_URL}/api/scan/${scanId}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || 'Scan status not found');
  }
  return data;
}

export async function cancelScan(scanId) {
  const response = await fetch(`${API_BASE_URL}/api/scan/${scanId}/cancel`, {
    method: 'POST',
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || 'Failed to cancel scan');
  }
  return data;
}

export async function fetchScanHistory() {
  const response = await fetch(`${API_BASE_URL}/api/history`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || 'Failed to load scan history');
  }
  return data;
}

export async function fetchScanHistoryDetail(scanId) {
  const response = await fetch(`${API_BASE_URL}/api/history/${scanId}`);
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || 'Scan detail not found');
  }
  return data;
}

export function getReportDownloadUrl(scanId, format) {
  return `${API_BASE_URL}/api/reports/${scanId}/${format}`;
}

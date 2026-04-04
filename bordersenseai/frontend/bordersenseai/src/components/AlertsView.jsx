import { useState, useEffect } from 'react';
import { socket } from '../socket';

export default function AlertsView() {
  const [alerts, setAlerts] = useState([
    { id: 1, type: 'Unauthorized Crossing', severity: 'critical', location: 'Sector A - KM 45', timestamp: '2024-01-15 14:30:22', status: 'active', description: 'Multiple individuals detected crossing border fence', model: 'YOLOv8-Custom', confidence: 96 },
    { id: 2, type: 'Suspicious Vehicle', severity: 'high', location: 'Sector B - Checkpoint 7', timestamp: '2024-01-15 09:15:45', status: 'active', description: 'Vehicle behaving erratically at checkpoint', model: 'ResNet-50', confidence: 89 },
    { id: 3, type: 'Illegal Activity', severity: 'high', location: 'Sector C - Forest Area', timestamp: '2024-01-15 08:42:11', status: 'acknowledged', description: 'Heat signatures detected in restricted zone', model: 'Thermal-XL', confidence: 92 },
    { id: 4, type: 'Border Breach', severity: 'medium', location: 'Sector A - KM 32', timestamp: '2024-01-15 07:28:33', status: 'active', description: 'Fence integrity compromised detected', model: 'YOLOv8-Custom', confidence: 78 },
    { id: 5, type: 'Movement Detected', severity: 'low', location: 'Sector D - Coastal', timestamp: '2024-01-15 06:55:18', status: 'resolved', description: 'Routine patrol movement detected', model: 'Motion-V3', confidence: 65 },
    { id: 6, type: 'Sensor Alert', severity: 'medium', location: 'Sector B - KM 18', timestamp: '2024-01-14 22:14:56', status: 'resolved', description: 'Ground sensor triggered by wildlife', model: 'Sensor-AI', confidence: 72 },
    { id: 7, type: 'Drone Intrusion', severity: 'critical', location: 'Sector A - Northern', timestamp: '2024-01-14 19:45:22', status: 'active', description: 'Unauthorized drone detected in restricted airspace', model: 'Drone-Detect', confidence: 98 },
    { id: 8, type: 'Cargo Suspicion', severity: 'high', location: 'Sector B - Port Entry', timestamp: '2024-01-14 16:32:08', status: 'investigating', description: 'X-ray anomaly detected in cargo container', model: 'Cargo-Scan', confidence: 85 },
  ]);

  const [filter, setFilter] = useState({ severity: 'all', status: 'all', search: '' });
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [viewMode, setViewMode] = useState('list');

  useEffect(() => {
    socket.on('new_alert', (alert) => {
      setAlerts(prev => [{ ...alert, id: Date.now() }, ...prev]);
    });
    return () => socket.off('new_alert');
  }, []);

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'critical': return { bg: 'bg-red-500/20', border: 'border-red-500', text: 'text-red-400', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' };
      case 'high': return { bg: 'bg-yellow-500/20', border: 'border-yellow-500', text: 'text-yellow-400', icon: 'M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' };
      case 'medium': return { bg: 'bg-blue-500/20', border: 'border-blue-500', text: 'text-blue-400', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' };
      case 'low': return { bg: 'bg-green-500/20', border: 'border-green-500', text: 'text-green-400', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' };
      default: return { bg: 'bg-slate-500/20', border: 'border-slate-500', text: 'text-slate-400', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' };
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'active': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'acknowledged': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'investigating': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'resolved': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (filter.severity !== 'all' && alert.severity !== filter.severity) return false;
    if (filter.status !== 'all' && alert.status !== filter.status) return false;
    if (filter.search && !alert.type.toLowerCase().includes(filter.search.toLowerCase()) && !alert.location.toLowerCase().includes(filter.search.toLowerCase())) return false;
    return true;
  });

  const stats = {
    critical: alerts.filter(a => a.severity === 'critical' && a.status === 'active').length,
    high: alerts.filter(a => a.severity === 'high' && a.status === 'active').length,
    medium: alerts.filter(a => a.severity === 'medium' && a.status === 'active').length,
    low: alerts.filter(a => a.severity === 'low' && a.status === 'active').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Alerts</h1>
          <p className="text-slate-400">Monitor and manage border security alerts</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-400'}`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
          <p className="text-red-400 text-sm font-medium">Critical</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.critical}</p>
        </div>
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <p className="text-yellow-400 text-sm font-medium">High</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.high}</p>
        </div>
        <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
          <p className="text-blue-400 text-sm font-medium">Medium</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.medium}</p>
        </div>
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl">
          <p className="text-green-400 text-sm font-medium">Low</p>
          <p className="text-3xl font-bold text-white mt-1">{stats.low}</p>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-700/50 flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search alerts..."
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={filter.severity}
              onChange={(e) => setFilter(prev => ({ ...prev, severity: e.target.value }))}
              className="px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Severities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <select
              value={filter.status}
              onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
              className="px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="acknowledged">Acknowledged</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>
        </div>

        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 gap-4 p-4' : 'divide-y divide-slate-700/50'}>
          {filteredAlerts.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No alerts found</div>
          ) : (
            filteredAlerts.map((alert) => {
              const style = getSeverityStyle(alert.severity);
              return (
                <div
                  key={alert.id}
                  onClick={() => setSelectedAlert(alert)}
                  className={`p-4 cursor-pointer hover:bg-slate-800/50 transition-colors ${viewMode === 'grid' ? 'bg-slate-900/30 rounded-xl border border-slate-700/50' : ''}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-10 h-10 rounded-lg ${style.bg} flex items-center justify-center flex-shrink-0`}>
                      <svg className={`w-5 h-5 ${style.text}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={style.icon} />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getStatusStyle(alert.status)}`}>
                          {alert.status}
                        </span>
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${style.bg} ${style.text}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <h3 className="text-white font-medium truncate">{alert.type}</h3>
                      <p className="text-sm text-slate-500 truncate">{alert.location}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                        <span>{alert.timestamp}</span>
                        <span>AI: {alert.confidence}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {selectedAlert && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedAlert(null)}>
          <div className="bg-slate-800 border border-slate-700 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">Alert Details</h2>
              <button onClick={() => setSelectedAlert(null)} className="p-2 hover:bg-slate-700 rounded-lg transition-colors">
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusStyle(selectedAlert.status)}`}>
                  {selectedAlert.status}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getSeverityStyle(selectedAlert.severity).bg} ${getSeverityStyle(selectedAlert.severity).text}`}>
                  {selectedAlert.severity}
                </span>
              </div>
              <div>
                <label className="text-sm text-slate-500">Alert Type</label>
                <p className="text-white font-medium">{selectedAlert.type}</p>
              </div>
              <div>
                <label className="text-sm text-slate-500">Location</label>
                <p className="text-white font-medium">{selectedAlert.location}</p>
              </div>
              <div>
                <label className="text-sm text-slate-500">Description</label>
                <p className="text-white">{selectedAlert.description}</p>
              </div>
              <div>
                <label className="text-sm text-slate-500">Timestamp</label>
                <p className="text-white">{selectedAlert.timestamp}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-500">AI Model</label>
                  <p className="text-white font-medium">{selectedAlert.model}</p>
                </div>
                <div>
                  <label className="text-sm text-slate-500">Confidence</label>
                  <p className="text-white font-medium">{selectedAlert.confidence}%</p>
                </div>
              </div>
              <div className="flex gap-3 pt-4 border-t border-slate-700/50">
                <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                  Acknowledge
                </button>
                <button className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg transition-colors">
                  Assign Team
                </button>
                <button className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 font-medium rounded-lg transition-colors">
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
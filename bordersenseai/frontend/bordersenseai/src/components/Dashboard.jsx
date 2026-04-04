import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MOCK_ALERTS = [
  { id: 1, type: 'Border Breach', severity: 'critical', location: 'Sector A - KM 45', time: '14:35', status: 'active' },
  { id: 2, type: 'Suspicious Vehicle', severity: 'high', location: 'Sector F - Checkpoint 12', time: '14:28', status: 'active' },
  { id: 3, type: 'Movement Detected', severity: 'medium', location: 'Sector E - KM 28', time: '14:15', status: 'investigating' },
  { id: 4, type: 'Sensor Alert', severity: 'low', location: 'Sector C', time: '14:02', status: 'resolved' },
];

const MOCK_PATROLS = [
  { id: 'PU-001', name: 'Patrol A1', type: 'Ground', status: 'active', officer: 'Subedar S. Singh' },
  { id: 'PU-002', name: 'Patrol A2', type: 'Ground', status: 'active', officer: 'Inspector A. Sharma' },
  { id: 'DR-001', name: 'Drone D1', type: 'Aerial', status: 'active', officer: 'AI Controlled' },
  { id: 'DR-002', name: 'Drone D2', type: 'Aerial', status: 'patrolling', officer: 'AI Controlled' },
];

const MOCK_ASSETS = [
  { type: 'Vehicles', total: 45, operational: 42 },
  { type: 'Drones', total: 12, operational: 10 },
  { type: 'Cameras', total: 89, operational: 82 },
  { type: 'Sensors', total: 156, operational: 148 },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    activeAlerts: 12,
    patrolsActive: 8,
    coverage: '94%',
    aiAccuracy: '97.2%',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        activeAlerts: prev.activeAlerts + Math.floor(Math.random() * 3) - 1,
        patrolsActive: Math.max(5, Math.min(15, prev.patrolsActive + Math.floor(Math.random() * 3) - 1)),
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">BorderSense AI Command Center</h1>
          <p className="text-slate-400 mt-1">Real-time operational overview - Indo-Tibet Border</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-green-400">AI System Active</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800/50 border border-red-500/30 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Active Alerts</p>
              <p className="text-3xl font-bold text-red-400">{stats.activeAlerts}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-green-500/30 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Patrols Active</p>
              <p className="text-3xl font-bold text-green-400">{stats.patrolsActive}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-blue-500/30 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Border Coverage</p>
              <p className="text-3xl font-bold text-blue-400">{stats.coverage}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-purple-500/30 rounded-xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">AI Accuracy</p>
              <p className="text-3xl font-bold text-purple-400">{stats.aiAccuracy}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Border Sectors Overview</h2>
              <Link to="/patrol" className="text-sm text-blue-400 hover:text-blue-300">Open GPS Map</Link>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['Karakoram (Ladakh)', 'Zanskar (Ladakh)', 'Kullu-Manali (HP)', 'Uttarakhand', 'Sikkim', 'Arunachal'].map((sector, i) => (
                  <div key={i} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">{sector}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${i < 2 ? 'bg-red-500/20 text-red-400' : i < 4 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                        {i < 2 ? 'High Risk' : i < 4 ? 'Medium' : 'Normal'}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span>Patrols: {Math.floor(Math.random() * 5) + 1}</span>
                      <span>Alerts: {Math.floor(Math.random() * 8)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Live Alerts Feed</h2>
              <Link to="/alerts" className="text-sm text-blue-400 hover:text-blue-300">View All</Link>
            </div>
            <div className="divide-y divide-slate-700/50">
              {MOCK_ALERTS.map(alert => (
                <div key={alert.id} className="p-4 hover:bg-slate-800/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getSeverityColor(alert.severity) }}></div>
                      <div>
                        <p className="text-white font-medium">{alert.type}</p>
                        <p className="text-sm text-slate-400">{alert.location}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        alert.status === 'active' ? 'bg-red-500/20 text-red-400' :
                        alert.status === 'investigating' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {alert.status}
                      </span>
                      <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700/50">
              <h2 className="text-lg font-semibold text-white">Resource Status</h2>
            </div>
            <div className="p-4 space-y-4">
              {MOCK_ASSETS.map(asset => (
                <div key={asset.type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-400">{asset.type}</span>
                    <span className="text-white">{asset.operational}/{asset.total}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${(asset.operational / asset.total) * 100}%` }}></div>
                  </div>
                </div>
              ))}
              <Link to="/assets" className="block text-center text-sm text-blue-400 hover:text-blue-300 mt-4">View All Resources</Link>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700/50">
              <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
            </div>
            <div className="p-4 space-y-2">
              <Link to="/surveillance" className="flex items-center gap-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors no-underline text-white">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>Live Surveillance</span>
              </Link>
              <Link to="/ai-detection" className="flex items-center gap-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors no-underline text-white">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>Threat Detection</span>
              </Link>
              <Link to="/duty" className="flex items-center gap-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors no-underline text-white">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>Assign Duty</span>
              </Link>
              <Link to="/officers" className="flex items-center gap-3 p-3 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors no-underline text-white">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>Personnel</span>
              </Link>
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700/50">
              <h2 className="text-lg font-semibold text-white">Active Patrols</h2>
            </div>
            <div className="p-4 space-y-2">
              {MOCK_PATROLS.map(p => (
                <div key={p.id} className="flex items-center justify-between p-2 bg-slate-900/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${p.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
                    <span className="text-white text-sm">{p.name}</span>
                  </div>
                  <span className="text-xs text-slate-400">{p.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

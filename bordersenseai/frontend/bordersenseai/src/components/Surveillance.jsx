import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const BORDER_WAYPOINTS = [
  { lat: 35.2268, lng: 77.6135, name: 'Karakoram Pass' },
  { lat: 34.5511, lng: 76.8723, name: 'Kargil Sector' },
  { lat: 33.7713, lng: 76.2784, name: 'Leh' },
  { lat: 32.6872, lng: 76.0421, name: 'Zanskar' },
  { lat: 31.8321, lng: 76.9969, name: 'Keylong' },
  { lat: 30.8814, lng: 77.0756, name: 'Manali' },
  { lat: 29.9785, lng: 78.5716, name: 'Badrinath' },
  { lat: 29.5527, lng: 80.2249, name: 'Nanda Devi' },
  { lat: 28.0859, lng: 85.4233, name: 'Nanda Devi East' },
  { lat: 27.3642, lng: 88.6432, name: 'Gangtok' },
  { lat: 27.1028, lng: 88.3108, name: 'Pakyong' },
  { lat: 27.3667, lng: 91.5167, name: 'Tawang' },
];

const MOCK_SURVEILLANCE = {
  satellites: [
    { id: 'SAT-1', name: 'Surveillance Sat-1', status: 'Active', coverage: 'Ladakh', lastUpdate: '2026-04-03 14:30' },
    { id: 'SAT-2', name: 'Surveillance Sat-2', status: 'Active', coverage: 'Arunachal', lastUpdate: '2026-04-03 14:28' },
  ],
  drones: [
    { id: 'DR-A1', name: 'Border Drone A1', status: 'Deployed', location: 'Sector A', battery: 78, lastUpdate: '2026-04-03 14:25' },
    { id: 'DR-B1', name: 'Border Drone B1', status: 'Active', location: 'Sector B', battery: 92, lastUpdate: '2026-04-03 14:29' },
    { id: 'DR-C1', name: 'Border Drone C1', status: 'Charging', location: 'Base', battery: 15, lastUpdate: '2026-04-03 14:20' },
  ],
  cameras: [
    { id: 'CAM-001', name: 'Checkpost Alpha', status: 'Active', location: 'KM 45', alerts: 2 },
    { id: 'CAM-002', name: 'Checkpost Beta', status: 'Active', location: 'KM 62', alerts: 0 },
    { id: 'CAM-003', name: 'Tower 12', status: 'Active', location: 'High Altitude', alerts: 1 },
    { id: 'CAM-004', name: 'Tower 15', status: 'Offline', location: 'Valley', alerts: 0 },
  ],
  sensors: [
    { id: 'SNS-001', name: 'Seismic Sensor A', status: 'Active', type: 'Seismic', detections: 12, lastUpdate: '2026-04-03 14:30' },
    { id: 'SNS-002', name: 'Thermal Sensor B', status: 'Active', type: 'Thermal', detections: 5, lastUpdate: '2026-04-03 14:29' },
    { id: 'SNS-003', name: 'Motion Sensor C', status: 'Active', type: 'Motion', detections: 28, lastUpdate: '2026-04-03 14:30' },
    { id: 'SNS-004', name: 'Acoustic Sensor D', status: 'Active', type: 'Acoustic', detections: 3, lastUpdate: '2026-04-03 14:28' },
  ],
};

const ANOMALIES = [
  { id: 1, type: 'Movement Detected', severity: 'high', location: 'Sector A - KM 45', time: '2026-04-03 14:28', confidence: 87, source: 'Thermal Sensor' },
  { id: 2, type: 'Unidentified Object', severity: 'medium', location: 'Sector B - Checkpoint 7', time: '2026-04-03 14:15', confidence: 72, source: 'Camera Feed' },
  { id: 3, type: 'Seismic Anomaly', severity: 'low', location: 'Sector C - KM 32', time: '2026-04-03 14:10', confidence: 45, source: 'Seismic Sensor' },
];

const ALERTS = [
  { id: 1, type: 'Border Breach', severity: 'critical', location: 'Sector A - KM 45', time: '2026-04-03 14:30', status: 'active' },
  { id: 2, type: 'Suspicious Vehicle', severity: 'high', location: 'Sector B', time: '2026-04-03 14:15', status: 'active' },
  { id: 3, type: 'Unauthorized Drone', severity: 'critical', location: 'Sector C', time: '2026-04-03 13:58', status: 'investigating' },
];

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const droneIcon = new L.DivIcon({
  className: 'custom-div-icon',
  html: '<div style="background-color:#3b82f6;width:20px;height:20px;border-radius:50%;border:2px solid white;display:flex;align-items:center;justify-content:center;"><svg width="12" height="12" viewBox="0 0 24 24" fill="white"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
});

export default function Surveillance() {
  const [activeTab, setActiveTab] = useState('overview');
  const [surveillance, setSurveillance] = useState(MOCK_SURVEILLANCE);
  const [anomalies, setAnomalies] = useState(ANOMALIES);
  const [selectedSource, setSelectedSource] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnomalies(prev => {
        const newAnomaly = {
          id: Date.now(),
          type: ['Movement Detected', 'Unidentified Object', 'Thermal Anomaly', 'Audio Alert'][Math.floor(Math.random() * 4)],
          severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
          location: `Sector ${['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)]} - KM ${Math.floor(Math.random() * 80) + 10}`,
          time: new Date().toISOString().slice(0, 16).replace('T', ' '),
          confidence: Math.floor(Math.random() * 40) + 60,
          source: ['Thermal Sensor', 'Camera Feed', 'Seismic Sensor', 'Audio Sensor'][Math.floor(Math.random() * 4)],
        };
        return [newAnomaly, ...prev.slice(0, 9)];
      });
    }, 15000);
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'satellites', label: 'Satellites', icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
    { id: 'drones', label: 'Drones', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
    { id: 'cameras', label: 'Cameras', icon: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z' },
    { id: 'sensors', label: 'Sensors', icon: 'M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z' },
    { id: 'anomalies', label: 'Anomalies', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
  ];

  return (
    <div className="surveillance-dashboard">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Supervise / Monitoring</h1>
          <p className="text-slate-400 mt-1">Real-time surveillance from satellites, drones, cameras & sensors</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-sm text-green-400">AI System Active</span>
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
            Refresh Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{surveillance.satellites.length}</p>
              <p className="text-sm text-slate-400">Satellites</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{surveillance.drones.filter(d => d.status === 'Deployed').length}</p>
              <p className="text-sm text-slate-400">Drones Deployed</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{surveillance.cameras.filter(c => c.status === 'Active').length}</p>
              <p className="text-sm text-slate-400">Cameras Active</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{surveillance.sensors.filter(s => s.status === 'Active').length}</p>
              <p className="text-sm text-slate-400">Sensors Active</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-1 mb-6 pb-2">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700/50">
              <h3 className="text-lg font-semibold text-white">Live Map - Indo-Tibet Border</h3>
            </div>
            <div className="h-[500px]">
              <MapContainer center={[32.0, 78.0]} zoom={6} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="OpenStreetMap" />
                <Polyline positions={BORDER_WAYPOINTS.map(p => [p.lat, p.lng])} color="#3b82f6" weight={3} opacity={0.8} dashArray="10, 5" />
                {BORDER_WAYPOINTS.map((point, idx) => (
                  <Marker key={idx} position={[point.lat, point.lng]} icon={customIcon}>
                    <Popup><strong>{point.name}</strong></Popup>
                  </Marker>
                ))}
                {surveillance.drones.filter(d => d.status === 'Deployed').map((drone, idx) => (
                  <Marker key={`drone-${idx}`} position={[33.5 + idx * 0.5, 76 + idx * 0.3]} icon={droneIcon}>
                    <Popup>
                      <strong>{drone.name}</strong><br />
                      Location: {drone.location}<br />
                      Battery: {drone.battery}%
                    </Popup>
                  </Marker>
                ))}
                <Circle center={[33.7713, 76.2784]} radius={50000} color="#22c55e" fillColor="#22c55e" fillOpacity={0.2} />
              </MapContainer>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white">Active Alerts</h3>
                <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs font-medium rounded-full">{ALERTS.length}</span>
              </div>
              <div className="p-3 space-y-2 max-h-[200px] overflow-y-auto">
                {ALERTS.map(alert => (
                  <div key={alert.id} className="p-3 bg-slate-900/50 rounded-lg border-l-4" style={{ borderColor: getSeverityColor(alert.severity) }}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">{alert.type}</span>
                      <span className="text-xs text-slate-500">{alert.time.slice(11)}</span>
                    </div>
                    <p className="text-xs text-slate-400">{alert.location}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-700/50">
                <h3 className="text-lg font-semibold text-white">AI Detected Anomalies</h3>
              </div>
              <div className="p-3 space-y-2 max-h-[240px] overflow-y-auto">
                {anomalies.slice(0, 5).map(anomaly => (
                  <div key={anomaly.id} className="p-3 bg-slate-900/50 rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">{anomaly.type}</span>
                      <span className="px-2 py-0.5 text-xs rounded-full" style={{ backgroundColor: `${getSeverityColor(anomaly.severity)}20`, color: getSeverityColor(anomaly.severity) }}>
                        {anomaly.severity}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{anomaly.location}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500">AI Confidence: {anomaly.confidence}%</span>
                      <span className="text-xs text-slate-500">• {anomaly.source}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'satellites' && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left p-4 text-sm font-medium text-slate-400">Satellite ID</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Name</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Status</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Coverage Area</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Last Update</th>
              </tr>
            </thead>
            <tbody>
              {surveillance.satellites.map(sat => (
                <tr key={sat.id} className="border-b border-slate-700/50 hover:bg-slate-800/50">
                  <td className="p-4 text-white font-medium">{sat.id}</td>
                  <td className="p-4 text-slate-300">{sat.name}</td>
                  <td className="p-4"><span className="status-badge status-operational">{sat.status}</span></td>
                  <td className="p-4 text-slate-300">{sat.coverage}</td>
                  <td className="p-4 text-slate-400 text-sm">{sat.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'drones' && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left p-4 text-sm font-medium text-slate-400">Drone ID</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Name</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Status</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Location</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Battery</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Last Update</th>
              </tr>
            </thead>
            <tbody>
              {surveillance.drones.map(drone => (
                <tr key={drone.id} className="border-b border-slate-700/50 hover:bg-slate-800/50">
                  <td className="p-4 text-white font-medium">{drone.id}</td>
                  <td className="p-4 text-slate-300">{drone.name}</td>
                  <td className="p-4">
                    <span className={`status-badge ${drone.status === 'Deployed' ? 'status-deployed' : drone.status === 'Active' ? 'status-operational' : 'status-maintenance'}`}>
                      {drone.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">{drone.location}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${drone.battery > 50 ? 'bg-green-500' : drone.battery > 20 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${drone.battery}%` }} />
                      </div>
                      <span className="text-sm text-slate-400">{drone.battery}%</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-400 text-sm">{drone.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'cameras' && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left p-4 text-sm font-medium text-slate-400">Camera ID</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Name</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Status</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Location</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Active Alerts</th>
              </tr>
            </thead>
            <tbody>
              {surveillance.cameras.map(cam => (
                <tr key={cam.id} className="border-b border-slate-700/50 hover:bg-slate-800/50">
                  <td className="p-4 text-white font-medium">{cam.id}</td>
                  <td className="p-4 text-slate-300">{cam.name}</td>
                  <td className="p-4">
                    <span className={`status-badge ${cam.status === 'Active' ? 'status-operational' : 'status-offline'}`}>
                      {cam.status}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">{cam.location}</td>
                  <td className="p-4">
                    {cam.alerts > 0 ? (
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 text-sm rounded-full">{cam.alerts}</span>
                    ) : (
                      <span className="text-slate-500">0</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'sensors' && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left p-4 text-sm font-medium text-slate-400">Sensor ID</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Name</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Type</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Status</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Detections</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Last Update</th>
              </tr>
            </thead>
            <tbody>
              {surveillance.sensors.map(sensor => (
                <tr key={sensor.id} className="border-b border-slate-700/50 hover:bg-slate-800/50">
                  <td className="p-4 text-white font-medium">{sensor.id}</td>
                  <td className="p-4 text-slate-300">{sensor.name}</td>
                  <td className="p-4 text-slate-300">{sensor.type}</td>
                  <td className="p-4"><span className="status-badge status-operational">{sensor.status}</span></td>
                  <td className="p-4 text-slate-300">{sensor.detections}</td>
                  <td className="p-4 text-slate-400 text-sm">{sensor.lastUpdate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'anomalies' && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left p-4 text-sm font-medium text-slate-400">Type</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Severity</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Location</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Source</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Confidence</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Time</th>
                <th className="text-left p-4 text-sm font-medium text-slate-400">Actions</th>
              </tr>
            </thead>
            <tbody>
              {anomalies.map(anomaly => (
                <tr key={anomaly.id} className="border-b border-slate-700/50 hover:bg-slate-800/50">
                  <td className="p-4 text-white font-medium">{anomaly.type}</td>
                  <td className="p-4">
                    <span className="px-2 py-1 text-xs rounded-full" style={{ backgroundColor: `${getSeverityColor(anomaly.severity)}20`, color: getSeverityColor(anomaly.severity) }}>
                      {anomaly.severity}
                    </span>
                  </td>
                  <td className="p-4 text-slate-300">{anomaly.location}</td>
                  <td className="p-4 text-slate-300">{anomaly.source}</td>
                  <td className="p-4 text-slate-300">{anomaly.confidence}%</td>
                  <td className="p-4 text-slate-400 text-sm">{anomaly.time}</td>
                  <td className="p-4">
                    <button className="btn-action btn-view">Investigate</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

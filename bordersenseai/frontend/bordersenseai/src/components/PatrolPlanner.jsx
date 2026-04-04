import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const INDO_TIBET_BORDER = [
  { lat: 35.5013, lng: 77.3712, name: 'Karakoram Pass', sector: 'A' },
  { lat: 35.2268, lng: 77.6135, name: 'Saser La', sector: 'A' },
  { lat: 34.5511, lng: 76.8723, name: 'Kargil', sector: 'A' },
  { lat: 34.3352, lng: 77.8932, name: 'Leh', sector: 'A' },
  { lat: 33.7713, lng: 76.2784, name: 'Indus Valley', sector: 'B' },
  { lat: 33.1478, lng: 75.8323, name: 'Zanskar', sector: 'B' },
  { lat: 32.6872, lng: 76.0421, name: 'Padum', sector: 'B' },
  { lat: 31.8321, lng: 76.9969, name: 'Keylong', sector: 'C' },
  { lat: 31.1033, lng: 77.1724, name: 'Manali', sector: 'C' },
  { lat: 30.8814, lng: 77.0756, name: 'Rohtang', sector: 'C' },
  { lat: 30.2183, lng: 78.2167, name: 'Chakrata', sector: 'C' },
  { lat: 29.9785, lng: 78.5716, name: 'Badrinath', sector: 'D' },
  { lat: 29.5527, lng: 80.2249, name: 'Nanda Devi', sector: 'D' },
  { lat: 29.2969, lng: 81.2748, name: 'Askot', sector: 'D' },
  { lat: 28.6472, lng: 83.9415, name: 'Damascus', sector: 'E' },
  { lat: 28.0859, lng: 85.4233, name: 'Nanda Devi East', sector: 'E' },
  { lat: 27.8428, lng: 86.7456, name: 'Kangchenjunga', sector: 'E' },
  { lat: 27.3642, lng: 88.6432, name: 'Gangtok', sector: 'F' },
  { lat: 27.1028, lng: 88.3108, name: 'Pakyong', sector: 'F' },
  { lat: 27.5919, lng: 91.7506, name: 'Tawang', sector: 'F' },
  { lat: 27.7538, lng: 92.4371, name: 'Tezu', sector: 'F' },
  { lat: 28.1074, lng: 95.3720, name: 'Roing', sector: 'G' },
  { lat: 28.6400, lng: 95.7529, name: 'Dibang Valley', sector: 'G' },
  { lat: 29.0485, lng: 96.5757, name: 'Anini', sector: 'G' },
];

const BORDER_SECTORS = [
  { id: 'A', name: 'Karakoram', region: 'Ladakh', riskLevel: 'high', alerts: 3 },
  { id: 'B', name: 'Zanskar', region: 'Ladakh', riskLevel: 'medium', alerts: 1 },
  { id: 'C', name: 'Kullu-Manali', region: 'Himachal', riskLevel: 'low', alerts: 0 },
  { id: 'D', name: 'Uttarakhand', region: 'Uttarakhand', riskLevel: 'medium', alerts: 2 },
  { id: 'E', name: 'Sikkim', region: 'Sikkim', riskLevel: 'high', alerts: 4 },
  { id: 'F', name: 'Arunachal', region: 'Arunachal', riskLevel: 'high', alerts: 5 },
  { id: 'G', name: 'Dibang', region: 'Arunachal', riskLevel: 'medium', alerts: 1 },
];

const PATROL_UNITS = [
  { id: 'PU-001', name: 'Patrol Unit A1', type: 'Ground', status: 'active', lat: 34.5511, lng: 76.8723, speed: 45, officer: 'Subedar Suresh Singh' },
  { id: 'PU-002', name: 'Patrol Unit A2', type: 'Ground', status: 'active', lat: 33.7713, lng: 76.2784, speed: 30, officer: 'Inspector Anil Sharma' },
  { id: 'PU-003', name: 'Drone Unit D1', type: 'Aerial', status: 'active', lat: 29.9785, lng: 78.5716, speed: 80, officer: 'AI Controlled' },
  { id: 'PU-004', name: 'Drone Unit D2', type: 'Aerial', status: 'active', lat: 27.3642, lng: 88.6432, speed: 75, officer: 'AI Controlled' },
  { id: 'PU-005', name: 'Patrol Unit B1', type: 'Ground', status: 'patrolling', lat: 31.1033, lng: 77.1724, speed: 25, officer: 'HC Ramesh Gupta' },
];

const AI_THREATS = [
  { id: 1, type: 'Movement Detected', confidence: 94, location: 'Sector A - KM 45', lat: 35.2268, lng: 77.6135, threat: true, timestamp: '2026-04-03 14:35:22' },
  { id: 2, type: 'Vehicle Detected', confidence: 87, location: 'Sector F - Checkpoint 12', lat: 27.1028, lng: 88.3108, threat: true, timestamp: '2026-04-03 14:34:15' },
  { id: 3, type: 'Thermal Anomaly', confidence: 78, location: 'Sector E - KM 28', lat: 28.0859, lng: 85.4233, threat: false, timestamp: '2026-04-03 14:33:08' },
  { id: 4, type: 'Unauthorized Crossing', confidence: 96, location: 'Sector G - Border Post 7', lat: 28.1074, lng: 95.3720, threat: true, timestamp: '2026-04-03 14:32:00' },
  { id: 5, type: 'Camera Tamper', confidence: 92, location: 'Sector D - Tower 15', lat: 29.5527, lng: 80.2249, threat: true, timestamp: '2026-04-03 14:30:45' },
];

const generateAIDetection = () => {
  const types = ['Movement Detected', 'Vehicle Detected', 'Thermal Anomaly', 'Unauthorized Crossing', 'Audio Alert', 'Object Detection'];
  const sectors = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
  const sector = sectors[Math.floor(Math.random() * sectors.length)];
  const borderPoint = INDO_TIBET_BORDER.filter(p => p.sector === sector)[Math.floor(Math.random() * 3)];
  
  return {
    id: Date.now(),
    type: types[Math.floor(Math.random() * types.length)],
    confidence: Math.floor(Math.random() * 20) + 75,
    location: `Sector ${sector} - KM ${Math.floor(Math.random() * 80) + 1}`,
    lat: borderPoint ? borderPoint.lat + (Math.random() - 0.5) * 0.5 : 32.0,
    lng: borderPoint ? borderPoint.lng + (Math.random() - 0.5) * 0.5 : 78.0,
    threat: Math.random() > 0.3,
    timestamp: new Date().toISOString().slice(0, 19).replace('T', ' ')
  };
};

const createCustomIcon = (color, isPulse = false) => {
  return new L.DivIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${color};
      width: ${isPulse ? '24px' : '20px'};
      height: ${isPulse ? '24px' : '20px'};
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 0 10px ${color};
      ${isPulse ? 'animation: pulse 1.5s infinite;' : ''}
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      ${isPulse ? '<div style="width:8px;height:8px;background:white;border-radius:50%"></div>' : ''}
    </div>`,
    iconSize: [isPulse ? 24 : 20, isPulse ? 24 : 20],
    iconAnchor: [isPulse ? 12 : 10, isPulse ? 12 : 10],
  });
};

const droneIcon = createCustomIcon('#3b82f6');
const patrolIcon = createCustomIcon('#22c55e');
const threatIcon = createCustomIcon('#ef4444', true);
const safeIcon = createCustomIcon('#22c55e');

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function PatrolPlanner() {
  const [activeTab, setActiveTab] = useState('map');
  const [patrolUnits, setPatrolUnits] = useState(PATROL_UNITS);
  const [aiThreats, setAiThreats] = useState(AI_THREATS);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [isLiveTracking, setIsLiveTracking] = useState(true);
  const [stats, setStats] = useState({
    totalPatrols: 12,
    activeDrones: 4,
    threatsDetected: 23,
    coverage: '94%'
  });
  const mapRef = useRef(null);

  useEffect(() => {
    if (!isLiveTracking) return;
    
    const threatInterval = setInterval(() => {
      const newDetection = generateAIDetection();
      setAiThreats(prev => [newDetection, ...prev.slice(0, 9)]);
    }, 8000);
    
    const patrolInterval = setInterval(() => {
      setPatrolUnits(prev => prev.map(unit => {
        if (unit.status === 'active') {
          return {
            ...unit,
            lat: unit.lat + (Math.random() - 0.5) * 0.02,
            lng: unit.lng + (Math.random() - 0.5) * 0.02,
            speed: Math.max(10, Math.min(80, unit.speed + (Math.random() - 0.5) * 10))
          };
        }
        return unit;
      }));
    }, 3000);

    return () => {
      clearInterval(threatInterval);
      clearInterval(patrolInterval);
    };
  }, [isLiveTracking]);

  const handleUnitSelect = (unit) => {
    setSelectedUnit(unit);
    setSelectedThreat(null);
  };

  const handleThreatSelect = (threat) => {
    setSelectedThreat(threat);
    setSelectedUnit(null);
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'high': return '#ef4444';
      case 'medium': return '#f97316';
      case 'low': return '#22c55e';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="patrol-planner">
      <style>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        .custom-marker { background: transparent !important; border: none !important; }
      `}</style>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Patrol Planner & Live Tracking</h1>
          <p className="text-slate-400 mt-1">AI-powered real-time border monitoring and patrol coordination</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsLiveTracking(!isLiveTracking)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 ${
                isLiveTracking ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-slate-700 text-slate-400 border border-slate-600'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isLiveTracking ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`}></span>
              {isLiveTracking ? 'AI Tracking Active' : 'Tracking Paused'}
            </button>
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
            Optimize Routes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{patrolUnits.filter(p => p.status === 'active').length}</p>
              <p className="text-sm text-slate-400">Active Units</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{patrolUnits.filter(p => p.type === 'Aerial').length}</p>
              <p className="text-sm text-slate-400">Drones Active</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{aiThreats.filter(t => t.threat).length}</p>
              <p className="text-sm text-slate-400">AI Threats</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.coverage}</p>
              <p className="text-sm text-slate-400">Border Coverage</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Indo-Tibet Border - Real-time AI Tracking</h3>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Live
              </span>
              <span className="text-xs text-slate-500">|</span>
              <span className="text-xs text-slate-400">AI Model: YOLOv8-Border v2.1</span>
            </div>
          </div>
          <div className="h-[600px] relative">
            <MapContainer 
              center={[31.5, 79.5]} 
              zoom={6} 
              style={{ height: '100%', width: '100%' }}
              ref={mapRef}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
              />
              <MapController center={[31.5, 79.5]} zoom={6} />
              
              <Polyline 
                positions={INDO_TIBET_BORDER.map(p => [p.lat, p.lng])} 
                color="#3b82f6" 
                weight={4} 
                opacity={0.9}
              />
              
              {INDO_TIBET_BORDER.map((point, idx) => (
                <Circle 
                  key={idx}
                  center={[point.lat, point.lng]} 
                  radius={8000} 
                  color={getRiskColor(BORDER_SECTORS.find(s => s.id === point.sector)?.riskLevel || 'medium')}
                  fillColor={getRiskColor(BORDER_SECTORS.find(s => s.id === point.sector)?.riskLevel || 'medium')}
                  fillOpacity={0.15}
                />
              ))}

              {patrolUnits.filter(p => p.type === 'Ground').map((unit) => (
                <Marker 
                  key={unit.id}
                  position={[unit.lat, unit.lng]}
                  icon={patrolIcon}
                  eventHandlers={{
                    click: () => handleUnitSelect(unit),
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong className="text-green-600">{unit.name}</strong><br/>
                      Officer: {unit.officer}<br/>
                      Speed: {Math.round(unit.speed)} km/h<br/>
                      Status: {unit.status}
                    </div>
                  </Popup>
                </Marker>
              ))}

              {patrolUnits.filter(p => p.type === 'Aerial').map((unit) => (
                <Marker 
                  key={unit.id}
                  position={[unit.lat, unit.lng]}
                  icon={droneIcon}
                  eventHandlers={{
                    click: () => handleUnitSelect(unit),
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong className="text-blue-600">{unit.name}</strong><br/>
                      Type: {unit.type}<br/>
                      Speed: {Math.round(unit.speed)} km/h<br/>
                      Controller: {unit.officer}
                    </div>
                  </Popup>
                </Marker>
              ))}

              {aiThreats.slice(0, 5).map((threat) => (
                <Marker 
                  key={threat.id}
                  position={[threat.lat, threat.lng]}
                  icon={threat.threat ? threatIcon : safeIcon}
                  eventHandlers={{
                    click: () => handleThreatSelect(threat),
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong className={threat.threat ? 'text-red-600' : 'text-green-600'}>
                        {threat.type}
                      </strong><br/>
                      Location: {threat.location}<br/>
                      AI Confidence: {threat.confidence}%<br/>
                      Time: {threat.timestamp}
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            <div className="absolute top-4 right-4 z-[1000] bg-slate-900/90 border border-slate-700 rounded-lg p-3 text-xs">
              <div className="font-medium text-white mb-2">Legend</div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-3 h-3 rounded-full bg-green-500"></span>
                <span className="text-slate-300">Patrol Unit</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                <span className="text-slate-300">Drone</span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-slate-300">Threat Detected</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border-2 border-blue-500"></span>
                <span className="text-slate-300">Border Line</span>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-700/50">
              <h4 className="font-semibold text-white">AI Detected Threats</h4>
            </div>
            <div className="p-3 space-y-2 max-h-[200px] overflow-y-auto">
              {aiThreats.slice(0, 5).map((threat) => (
                <div 
                  key={threat.id} 
                  onClick={() => handleThreatSelect(threat)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedThreat?.id === threat.id ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-slate-900/50 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${threat.threat ? 'text-red-400' : 'text-green-400'}`}>
                      {threat.type}
                    </span>
                    <span className="text-xs text-slate-500">{threat.confidence}%</span>
                  </div>
                  <p className="text-xs text-slate-400">{threat.location}</p>
                  <p className="text-xs text-slate-500 mt-1">{threat.timestamp}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-700/50">
              <h4 className="font-semibold text-white">Border Sectors</h4>
            </div>
            <div className="p-3 space-y-2 max-h-[250px] overflow-y-auto">
              {BORDER_SECTORS.map((sector) => (
                <div key={sector.id} className="flex items-center justify-between p-2 bg-slate-900/50 rounded-lg">
                  <div>
                    <span className="text-sm font-medium text-white">Sector {sector.id}</span>
                    <span className="text-xs text-slate-500 block">{sector.name}</span>
                  </div>
                  <div className="text-right">
                    <span 
                      className="px-2 py-0.5 text-xs rounded-full"
                      style={{ 
                        backgroundColor: `${getRiskColor(sector.riskLevel)}20`, 
                        color: getRiskColor(sector.riskLevel)
                      }}
                    >
                      {sector.riskLevel}
                    </span>
                    {sector.alerts > 0 && (
                      <span className="block text-xs text-red-400 mt-1">{sector.alerts} alerts</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-700/50">
              <h4 className="font-semibold text-white">Active Units</h4>
            </div>
            <div className="p-3 space-y-2">
              {patrolUnits.map((unit) => (
                <div 
                  key={unit.id}
                  onClick={() => handleUnitSelect(unit)}
                  className={`p-2 rounded-lg cursor-pointer ${
                    selectedUnit?.id === unit.id ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-slate-900/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-white">{unit.name}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      unit.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {unit.status}
                    </span>
                  </div>
                  <span className="text-xs text-slate-500">{unit.type} • {Math.round(unit.speed)} km/h</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

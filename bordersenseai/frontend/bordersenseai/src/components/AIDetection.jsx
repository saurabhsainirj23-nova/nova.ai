import { useState, useEffect, useRef, useCallback } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as cocoSsd from '@tensorflow-models/coco-ssd';

const BORDER_SECTORS = [
  { id: 'A', name: 'Karakoram', lat: 35.2, lng: 77.6, risk: 'high' },
  { id: 'B', name: 'Zanskar', lat: 33.8, lng: 76.3, risk: 'medium' },
  { id: 'C', name: 'Kullu-Manali', lat: 31.1, lng: 77.2, risk: 'low' },
  { id: 'D', name: 'Uttarakhand', lat: 29.9, lng: 78.6, risk: 'medium' },
  { id: 'E', name: 'Sikkim', lat: 27.4, lng: 88.6, risk: 'high' },
  { id: 'F', name: 'Arunachal', lat: 27.1, lng: 88.3, risk: 'high' },
];

const SENSOR_TYPES = [
  { id: 'thermal-1', name: 'Thermal Sensor T-001', type: 'Thermal', location: 'Sector A', status: 'active', lastReading: '36.2°C', sensitivity: 'High' },
  { id: 'seismic-1', name: 'Seismic Sensor S-001', type: 'Seismic', location: 'Sector B', status: 'active', lastReading: '0.02g', sensitivity: 'Medium' },
  { id: 'motion-1', name: 'Motion Sensor M-001', type: 'Motion', location: 'Sector C', status: 'active', lastReading: '0 detections', sensitivity: 'High' },
  { id: 'acoustic-1', name: 'Acoustic Sensor A-001', type: 'Acoustic', location: 'Sector D', status: 'active', lastReading: '45dB', sensitivity: 'Medium' },
  { id: 'radar-1', name: 'Radar Unit R-001', type: 'Radar', location: 'Sector E', status: 'active', lastReading: 'Clear', sensitivity: 'Very High' },
  { id: 'infrared-1', name: 'Infrared Sensor IR-001', type: 'Infrared', location: 'Sector F', status: 'active', lastReading: 'No movement', sensitivity: 'High' },
];

const CCTV_FEEDS = [
  { id: 'cam-1', name: 'Checkpost Alpha', location: 'Sector A', resolution: '1080p', status: 'active', lastMotion: '2 min ago' },
  { id: 'cam-2', name: 'Tower 12', location: 'Sector B', resolution: '4K', status: 'active', lastMotion: '5 min ago' },
  { id: 'cam-3', name: 'Border Post 7', location: 'Sector C', resolution: '1080p', status: 'active', lastMotion: '1 min ago' },
  { id: 'cam-4', name: 'Valley Camera', location: 'Sector D', resolution: '720p', status: 'offline', lastMotion: 'N/A' },
  { id: 'cam-5', name: 'Mountain Cam', location: 'Sector E', resolution: '1080p', status: 'active', lastMotion: '3 min ago' },
  { id: 'cam-6', name: 'River Crossing', location: 'Sector F', resolution: '4K', status: 'active', lastMotion: '10 min ago' },
];

const SIMULATED_THREATS = [
  { id: 1, type: 'Unauthorized Person', confidence: 94, location: 'Sector A - KM 45', sensor: 'Thermal', time: '14:35:22', threat: true },
  { id: 2, type: 'Vehicle Detected', confidence: 87, location: 'Sector F - Checkpoint 12', sensor: 'Radar', time: '14:34:15', threat: true },
  { id: 3, type: 'Movement Detected', confidence: 78, location: 'Sector E - KM 28', sensor: 'Motion', time: '14:33:08', threat: false },
  { id: 4, type: 'Thermal Anomaly', confidence: 92, location: 'Sector D - KM 62', sensor: 'Thermal', time: '14:32:00', threat: true },
];

export default function AIDetection() {
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [model, setModel] = useState(null);
  const [detections, setDetections] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [sensors, setSensors] = useState(SENSOR_TYPES);
  const [cctvFeeds] = useState(CCTV_FEEDS);
  const [threats, setThreats] = useState(SIMULATED_THREATS);
  const [aiStats] = useState({
    totalDetections: 1247,
    threatsNeutralized: 89,
    avgResponseTime: '4.2s',
    accuracy: '97.2%'
  });

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const animationRef = useRef(null);

  const loadModel = useCallback(async () => {
    try {
      await tf.ready();
      const loadedModel = await cocoSsd.load({ base: 'lite_mobilenet_v2' });
      setModel(loadedModel);
      setIsModelLoaded(true);
    } catch (error) {
      console.error('Model loading error:', error);
    }
  }, []);

  useEffect(() => {
    loadModel();
    const sensorInterval = setInterval(() => {
      setSensors(prev => prev.map(s => ({
        ...s,
        lastReading: generateSensorReading(s.type),
      })));
    }, 3000);

    const threatInterval = setInterval(() => {
      if (Math.random() > 0.5) {
        const newThreat = generateRandomThreat();
        setThreats(prev => [newThreat, ...prev.slice(0, 19)]);
      }
    }, 5000);

    return () => {
      clearInterval(sensorInterval);
      clearInterval(threatInterval);
    };
  }, []);

  const generateSensorReading = (type) => {
    switch (type) {
      case 'Thermal': return `${(35 + Math.random() * 5).toFixed(1)}°C`;
      case 'Seismic': return `${(Math.random() * 0.1).toFixed(3)}g`;
      case 'Motion': return Math.random() > 0.7 ? 'Movement detected' : 'No movement';
      case 'Acoustic': return `${(40 + Math.random() * 30).toFixed(0)}dB`;
      case 'Radar': return Math.random() > 0.8 ? 'Contact detected' : 'Clear';
      case 'Infrared': return Math.random() > 0.6 ? 'Heat signature' : 'No detection';
      default: return 'Normal';
    }
  };

  const generateRandomThreat = () => {
    const types = ['Movement Detected', 'Vehicle Detected', 'Thermal Anomaly', 'Audio Alert', 'Radar Contact'];
    const sectors = BORDER_SECTORS;
    const sector = sectors[Math.floor(Math.random() * sectors.length)];
    return {
      id: Date.now(),
      type: types[Math.floor(Math.random() * types.length)],
      confidence: Math.floor(Math.random() * 20) + 75,
      location: `Sector ${sector.id} - KM ${Math.floor(Math.random() * 80) + 1}`,
      sensor: ['Thermal', 'Radar', 'Motion', 'Acoustic'][Math.floor(Math.random() * 4)],
      time: new Date().toISOString().slice(11, 19),
      threat: Math.random() > 0.3,
    };
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: 640, height: 480 }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setIsWebcamActive(true);
        detectObjects();
      }
    } catch (error) {
      console.error('Webcam error:', error);
    }
  };

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsWebcamActive(false);
  };

  const detectObjects = useCallback(async () => {
    if (!model || !videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    const predictions = await model.detect(video);

    predictions.forEach(prediction => {
      if (prediction.score > 0.5) {
        ctx.beginPath();
        ctx.rect(prediction.bbox[0], prediction.bbox[1], prediction.bbox[2], prediction.bbox[3]);
        ctx.lineWidth = 3;
        ctx.strokeStyle = prediction.class === 'person' ? '#ef4444' : '#3b82f6';
        ctx.stroke();
      }
    });

    const newDetections = predictions
      .filter(p => p.score > 0.5)
      .map(p => ({
        class: p.class,
        confidence: Math.round(p.score * 100),
        timestamp: new Date().toISOString().slice(11, 19)
      }));

    if (newDetections.length > 0) {
      setDetections(prev => [...newDetections, ...prev].slice(0, 15));
    }

    animationRef.current = requestAnimationFrame(detectObjects);
  }, [model]);

  useEffect(() => {
    if (isWebcamActive) {
      detectObjects();
    }
  }, [isWebcamActive, detectObjects]);

  const tabs = [
    { id: 'overview', label: 'AI Overview' },
    { id: 'sensors', label: 'Sensors' },
    { id: 'cctv', label: 'CCTV Feeds' },
    { id: 'webcam', label: 'Live Detection' },
  ];

  return (
    <div className="ai-detection">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">AI-Powered Threat Detection System</h1>
          <p className="text-slate-400 mt-1">Multi-sensor AI analysis with real-time threat detection</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 border border-green-500/30 rounded-full">
            <span className={`w-2 h-2 rounded-full ${isModelLoaded ? 'bg-green-500 animate-pulse' : 'bg-yellow-500'}`}></span>
            <span className="text-sm text-green-400">{isModelLoaded ? 'AI Engine Online' : 'Loading AI...'}</span>
          </div>
          <div className="px-3 py-1.5 bg-blue-500/20 border border-blue-500/30 rounded-full">
            <span className="text-sm text-blue-400">COCO-SSD Model</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/50 border border-blue-500/30 rounded-xl p-4">
          <p className="text-slate-400 text-sm">Total Detections</p>
          <p className="text-2xl font-bold text-white">{aiStats.totalDetections.toLocaleString()}</p>
        </div>
        <div className="bg-slate-800/50 border border-red-500/30 rounded-xl p-4">
          <p className="text-slate-400 text-sm">Threats Neutralized</p>
          <p className="text-2xl font-bold text-red-400">{aiStats.threatsNeutralized}</p>
        </div>
        <div className="bg-slate-800/50 border border-yellow-500/30 rounded-xl p-4">
          <p className="text-slate-400 text-sm">Avg Response</p>
          <p className="text-2xl font-bold text-yellow-400">{aiStats.avgResponseTime}</p>
        </div>
        <div className="bg-slate-800/50 border border-green-500/30 rounded-xl p-4">
          <p className="text-slate-400 text-sm">AI Accuracy</p>
          <p className="text-2xl font-bold text-green-400">{aiStats.accuracy}</p>
        </div>
      </div>

      <div className="flex overflow-x-auto gap-2 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700/50">
              <h3 className="text-lg font-semibold text-white">Real-Time Threat Feed</h3>
            </div>
            <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
              {threats.map(threat => (
                <div key={threat.id} className="p-3 bg-slate-900/50 rounded-lg border-l-4"
                  style={{ borderColor: threat.threat ? '#ef4444' : '#22c55e' }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-medium ${threat.threat ? 'text-red-400' : 'text-green-400'}`}>
                      {threat.type}
                    </span>
                    <span className="text-xs text-slate-500">{threat.time}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-400">{threat.location}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-blue-400">{threat.sensor}</span>
                      <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded">{threat.confidence}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700/50">
              <h3 className="text-lg font-semibold text-white">Border Sectors Risk Analysis</h3>
            </div>
            <div className="p-4 space-y-3">
              {BORDER_SECTORS.map(sector => (
                <div key={sector.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                  <div>
                    <span className="text-white font-medium">Sector {sector.id}</span>
                    <span className="text-slate-400 text-sm ml-2">- {sector.name}</span>
                  </div>
                  <span className={`px-3 py-1 text-xs rounded-full ${
                    sector.risk === 'high' ? 'bg-red-500/20 text-red-400' :
                    sector.risk === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {sector.risk.toUpperCase()} RISK
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sensors' && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white">Multi-Sensor Network</h3>
            <span className="text-sm text-green-400">{sensors.filter(s => s.status === 'active').length} Active</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {sensors.map(sensor => (
              <div key={sensor.id} className="p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{sensor.name}</span>
                  <span className={`w-2 h-2 rounded-full ${sensor.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Type:</span>
                    <span className="text-white">{sensor.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Location:</span>
                    <span className="text-white">{sensor.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reading:</span>
                    <span className="text-blue-400">{sensor.lastReading}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sensitivity:</span>
                    <span className="text-yellow-400">{sensor.sensitivity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'cctv' && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-700/50">
            <h3 className="text-lg font-semibold text-white">CCTV Camera Network</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {cctvFeeds.map(camera => (
              <div key={camera.id} className="relative bg-slate-900 rounded-lg overflow-hidden">
                <div className="h-32 bg-slate-800 flex items-center justify-center">
                  {camera.status === 'active' ? (
                    <svg className="w-12 h-12 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  ) : (
                    <svg className="w-12 h-12 text-red-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  )}
                </div>
                <div className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">{camera.name}</span>
                    <span className={`px-2 py-0.5 text-xs rounded ${camera.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                      {camera.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    <p>{camera.location}</p>
                    <p>{camera.resolution} | Last motion: {camera.lastMotion}</p>
                  </div>
                </div>
                {camera.status === 'active' && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'webcam' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700/50 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Live Camera Detection</h3>
              <button
                onClick={isWebcamActive ? stopWebcam : startWebcam}
                disabled={!isModelLoaded}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  isWebcamActive 
                    ? 'bg-red-600 hover:bg-red-700' 
                    : 'bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600'
                } text-white`}
              >
                {isWebcamActive ? 'Stop Camera' : 'Start Camera'}
              </button>
            </div>
            <div className="relative bg-black">
              <video ref={videoRef} className={`w-full ${isWebcamActive ? 'block' : 'hidden'}`} style={{ maxHeight: '400px', objectFit: 'cover' }} playsInline muted />
              <canvas ref={canvasRef} className={`absolute top-0 left-0 w-full ${isWebcamActive ? 'block' : 'hidden'}`} style={{ maxHeight: '400px', objectFit: 'cover' }} />
              {!isWebcamActive && (
                <div className="h-[400px] flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <p className="text-slate-400">Click "Start Camera" to enable AI detection</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-700/50">
              <h3 className="text-lg font-semibold text-white">Detection Results</h3>
            </div>
            <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
              {detections.length === 0 ? (
                <p className="text-slate-500 text-center py-8">No objects detected yet</p>
              ) : (
                detections.map((det, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={`w-2 h-2 rounded-full ${det.class === 'person' ? 'bg-red-500' : 'bg-blue-500'}`}></span>
                      <span className="text-white capitalize">{det.class}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-green-400 font-medium">{det.confidence}%</span>
                      <span className="text-slate-500 text-xs ml-2">{det.timestamp}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-slate-700/50">
              <div className="flex flex-wrap gap-2">
                {['person', 'car', 'truck', 'bicycle', 'motorcycle', 'dog', 'cat'].map(cls => (
                  <span key={cls} className="px-2 py-1 bg-slate-700/50 text-slate-300 text-xs rounded">{cls}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState } from 'react';

export default function ReportGenerator({ alerts, addReport }) {
  const [reportType, setReportType] = useState('daily');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [filters, setFilters] = useState({
    severity: 'all',
    status: 'all',
    region: 'all',
  });
  const [generating, setGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);

  const reportTypes = [
    { id: 'daily', name: 'Daily Summary', desc: 'Overview of daily alerts and activities', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'weekly', name: 'Weekly Analytics', desc: 'Detailed weekly statistics and trends', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'incident', name: 'Incident Report', desc: 'Detailed incident documentation', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
    { id: 'patrol', name: 'Patrol Performance', desc: 'Patrol routes and officer performance', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
    { id: 'ai', name: 'AI Detection Analysis', desc: 'Model accuracy and feedback analysis', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ];

  const mockData = {
    daily: {
      title: 'Daily Summary Report',
      generatedAt: new Date().toLocaleString(),
      summary: { totalAlerts: 24, critical: 3, high: 8, medium: 10, low: 3 },
      topRegions: ['Sector A - Northern Border', 'Sector B - Eastern Border', 'Sector C - Western Border'],
      recommendations: [
        'Increase patrol frequency in Sector A due to high alert volume',
        'Review AI model accuracy for medium-severity detections',
        'Coordinate with local authorities for cross-border activity',
      ],
    },
    weekly: {
      title: 'Weekly Analytics Report',
      generatedAt: new Date().toLocaleString(),
      stats: { totalAlerts: 156, avgResponseTime: '12 min', patrolCoverage: '94%', aiAccuracy: '97.2%' },
      trends: ['Alert volume increased 12% from last week', 'Critical incidents decreased 8%', 'Patrol efficiency improved 15%'],
    },
    incident: {
      title: 'Incident Report',
      generatedAt: new Date().toLocaleString(),
      incidents: [
        { id: 1, type: 'Unauthorized Crossing', location: 'Sector A - KM 45', time: '14:30', status: 'Resolved' },
        { id: 2, type: 'Suspicious Vehicle', location: 'Sector B - Checkpoint 7', time: '09:15', status: 'Under Investigation' },
      ],
    },
    patrol: {
      title: 'Patrol Performance Report',
      generatedAt: new Date().toLocaleString(),
      performance: { totalPatrols: 45, totalDistance: '1,240 km', hoursPatrolled: 180, officersDeployed: 12 },
    },
    ai: {
      title: 'AI Detection Analysis',
      generatedAt: new Date().toLocaleString(),
      modelStats: { totalDetections: 892, accuracy: '97.2%', falsePositives: 24, feedbackReceived: 156 },
    },
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGeneratedReport(mockData[reportType]);
      setGenerating(false);
    }, 1500);
  };

  const handleExport = (format) => {
    const dataStr = JSON.stringify(generatedReport, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `report-${reportType}-${Date.now()}.${format}`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Reports</h1>
          <p className="text-slate-400">Generate and export detailed reports</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reportTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => { setReportType(type.id); setGeneratedReport(null); }}
            className={`p-5 rounded-xl border transition-all text-left ${
              reportType === type.id
                ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:border-slate-600'
            }`}
          >
            <div className="w-12 h-12 rounded-lg bg-slate-700/50 flex items-center justify-center mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={type.icon} />
              </svg>
            </div>
            <h3 className="font-semibold">{type.name}</h3>
            <p className="text-sm text-slate-500 mt-1">{type.desc}</p>
          </button>
        ))}
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-700/50">
          <h2 className="text-lg font-semibold text-white">Report Configuration</h2>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">End Date</label>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Severity Filter</label>
              <select
                value={filters.severity}
                onChange={(e) => setFilters(prev => ({ ...prev, severity: e.target.value }))}
                className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical Only</option>
                <option value="high">High and Above</option>
                <option value="medium">Medium and Above</option>
              </select>
            </div>
          </div>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            {generating ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Generate Report
              </>
            )}
          </button>
        </div>
      </div>

      {generatedReport && (
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">{generatedReport.title}</h2>
            <div className="flex gap-2">
              <button onClick={() => handleExport('json')} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors">
                Export JSON
              </button>
              <button onClick={() => handleExport('pdf')} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors">
                Export PDF
              </button>
            </div>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Generated: {generatedReport.generatedAt}
            </div>

            {generatedReport.summary && (
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-4 bg-slate-900/30 rounded-lg text-center">
                  <p className="text-2xl font-bold text-white">{generatedReport.summary.totalAlerts}</p>
                  <p className="text-xs text-slate-500">Total Alerts</p>
                </div>
                <div className="p-4 bg-red-500/10 rounded-lg text-center border border-red-500/20">
                  <p className="text-2xl font-bold text-red-400">{generatedReport.summary.critical}</p>
                  <p className="text-xs text-slate-500">Critical</p>
                </div>
                <div className="p-4 bg-yellow-500/10 rounded-lg text-center border border-yellow-500/20">
                  <p className="text-2xl font-bold text-yellow-400">{generatedReport.summary.high}</p>
                  <p className="text-xs text-slate-500">High</p>
                </div>
                <div className="p-4 bg-blue-500/10 rounded-lg text-center border border-blue-500/20">
                  <p className="text-2xl font-bold text-blue-400">{generatedReport.summary.medium}</p>
                  <p className="text-xs text-slate-500">Medium</p>
                </div>
                <div className="p-4 bg-green-500/10 rounded-lg text-center border border-green-500/20">
                  <p className="text-2xl font-bold text-green-400">{generatedReport.summary.low}</p>
                  <p className="text-xs text-slate-500">Low</p>
                </div>
              </div>
            )}

            {generatedReport.stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(generatedReport.stats).map(([key, value]) => (
                  <div key={key} className="p-4 bg-slate-900/30 rounded-lg">
                    <p className="text-sm text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="text-xl font-bold text-white mt-1">{value}</p>
                  </div>
                ))}
              </div>
            )}

            {generatedReport.topRegions && (
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-3">Top Alert Regions</h3>
                <div className="space-y-2">
                  {generatedReport.topRegions.map((region, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-3 bg-slate-900/30 rounded-lg">
                      <span className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 text-xs font-medium flex items-center justify-center">{idx + 1}</span>
                      <span className="text-white">{region}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {generatedReport.incidents && (
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-3">Recent Incidents</h3>
                <div className="space-y-3">
                  {generatedReport.incidents.map((incident) => (
                    <div key={incident.id} className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{incident.type}</p>
                        <p className="text-sm text-slate-500">{incident.location} • {incident.time}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        incident.status === 'Resolved' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {incident.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {generatedReport.performance && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(generatedReport.performance).map(([key, value]) => (
                  <div key={key} className="p-4 bg-slate-900/30 rounded-lg text-center">
                    <p className="text-sm text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="text-xl font-bold text-white mt-1">{value}</p>
                  </div>
                ))}
              </div>
            )}

            {generatedReport.modelStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(generatedReport.modelStats).map(([key, value]) => (
                  <div key={key} className="p-4 bg-slate-900/30 rounded-lg text-center">
                    <p className="text-sm text-slate-500 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                    <p className="text-xl font-bold text-white mt-1">{value}</p>
                  </div>
                ))}
              </div>
            )}

            {generatedReport.recommendations && (
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-3">Recommendations</h3>
                <ul className="space-y-2">
                  {generatedReport.recommendations.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-3 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                      <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                      <span className="text-white text-sm">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
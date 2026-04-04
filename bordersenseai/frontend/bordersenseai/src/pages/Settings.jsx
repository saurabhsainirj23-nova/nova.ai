import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [settings, setSettings] = useState({
    notifications: true,
    emailAlerts: false,
    darkMode: true,
    autoRefresh: true,
    refreshInterval: 30,
    mapStyle: 'satellite',
    showCritical: true,
    showHigh: true,
    showMedium: true,
    showLow: true,
  });

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'notifications', label: 'Notifications', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { id: 'display', label: 'Display', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { id: 'security', label: 'Security', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-56 flex-shrink-0">
          <nav className="flex md:flex-col gap-1 p-1 bg-slate-800/50 rounded-xl">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={tab.icon} />
                </svg>
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="flex-1">
          {activeTab === 'profile' && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700/50">
                <h2 className="text-lg font-semibold text-white">Profile Settings</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-2xl font-bold">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors">
                      Change Photo
                    </button>
                    <p className="text-xs text-slate-500 mt-1">JPG, PNG. Max 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name || 'User'}
                      className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
                    <input
                      type="text"
                      defaultValue={user?.username || ''}
                      className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email || 'user@bordersense.ai'}
                      className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                    <input
                      type="text"
                      defaultValue={user?.roles?.join(', ') || 'User'}
                      className="w-full px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                      disabled
                    />
                  </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-700/50">
                  <button className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700/50">
                <h2 className="text-lg font-semibold text-white">Notification Preferences</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Push Notifications</p>
                      <p className="text-sm text-slate-400">Receive alerts on desktop</p>
                    </div>
                    <button
                      onClick={() => handleToggle('notifications')}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.notifications ? 'bg-blue-600' : 'bg-slate-600'
                      }`}
                    >
                      <span className={`block w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.notifications ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Email Alerts</p>
                      <p className="text-sm text-slate-400">Receive critical alerts via email</p>
                    </div>
                    <button
                      onClick={() => handleToggle('emailAlerts')}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.emailAlerts ? 'bg-blue-600' : 'bg-slate-600'
                      }`}
                    >
                      <span className={`block w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.emailAlerts ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-900/30 rounded-lg">
                    <div>
                      <p className="text-white font-medium">Auto Refresh</p>
                      <p className="text-sm text-slate-400">Automatically refresh dashboard data</p>
                    </div>
                    <button
                      onClick={() => handleToggle('autoRefresh')}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        settings.autoRefresh ? 'bg-blue-600' : 'bg-slate-600'
                      }`}
                    >
                      <span className={`block w-5 h-5 bg-white rounded-full transition-transform ${
                        settings.autoRefresh ? 'translate-x-6' : 'translate-x-0.5'
                      }`} />
                    </button>
                  </div>
                </div>

                {settings.autoRefresh && (
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Refresh Interval (seconds)</label>
                    <select
                      value={settings.refreshInterval}
                      onChange={(e) => handleChange('refreshInterval', parseInt(e.target.value))}
                      className="w-full md:w-48 px-4 py-2.5 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
                    >
                      <option value={10}>10 seconds</option>
                      <option value={30}>30 seconds</option>
                      <option value={60}>1 minute</option>
                      <option value={300}>5 minutes</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'display' && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700/50">
                <h2 className="text-lg font-semibold text-white">Display Settings</h2>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Map Style</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['satellite', 'street', 'terrain', 'hybrid'].map(style => (
                      <button
                        key={style}
                        onClick={() => handleChange('mapStyle', style)}
                        className={`px-4 py-3 rounded-lg border transition-all ${
                          settings.mapStyle === style
                            ? 'bg-blue-600/20 border-blue-500 text-blue-400'
                            : 'bg-slate-900/30 border-slate-700 text-slate-400 hover:border-slate-600'
                        }`}
                      >
                        {style.charAt(0).toUpperCase() + style.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Show Alert Types</label>
                  <div className="space-y-3">
                    {[
                      { key: 'showCritical', label: 'Critical', color: 'bg-red-500' },
                      { key: 'showHigh', label: 'High', color: 'bg-yellow-500' },
                      { key: 'showMedium', label: 'Medium', color: 'bg-blue-500' },
                      { key: 'showLow', label: 'Low', color: 'bg-green-500' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between p-3 bg-slate-900/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <span className={`w-3 h-3 rounded-full ${item.color}`} />
                          <span className="text-white">{item.label}</span>
                        </div>
                        <button
                          onClick={() => handleToggle(item.key)}
                          className={`w-10 h-5 rounded-full transition-colors ${
                            settings[item.key] ? 'bg-blue-600' : 'bg-slate-600'
                          }`}
                        >
                          <span className={`block w-4 h-4 bg-white rounded-full transition-transform ${
                            settings[item.key] ? 'translate-x-5' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700/50">
                <h2 className="text-lg font-semibold text-white">Security Settings</h2>
              </div>
              <div className="p-6 space-y-6">
                <div className="p-4 bg-slate-900/30 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-white font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-slate-400">Add an extra layer of security</p>
                    </div>
                    <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">Enabled</span>
                  </div>
                  <button className="text-blue-400 text-sm hover:text-blue-300">Configure 2FA</button>
                </div>

                <div className="p-4 bg-slate-900/30 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-white font-medium">Change Password</p>
                      <p className="text-sm text-slate-400">Update your account password</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg transition-colors">
                    Change Password
                  </button>
                </div>

                <div className="p-4 bg-slate-900/30 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-white font-medium">Active Sessions</p>
                      <p className="text-sm text-slate-400">Manage your active login sessions</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg mb-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <div className="flex-1">
                      <p className="text-white text-sm">Current Session</p>
                      <p className="text-xs text-slate-500">Chrome on Windows • Active now</p>
                    </div>
                  </div>
                  <button className="text-red-400 text-sm hover:text-red-300">Sign out all other sessions</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
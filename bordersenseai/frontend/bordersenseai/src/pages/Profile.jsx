import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const { user } = useAuth();

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' };
      case 'COMMAND_CENTER': return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' };
      case 'FIELD_OFFICER': return { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' };
      default: return { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30' };
    }
  };

  const stats = [
    { label: 'Total Alerts Handled', value: '247', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { label: 'Patrols Completed', value: '89', icon: 'M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7' },
    { label: 'Reports Submitted', value: '156', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { label: 'Days Active', value: '42', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              {user?.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{user?.name || 'User'}</h1>
              <p className="text-slate-400">@{user?.username}</p>
              <div className="flex gap-2 mt-3">
                {user?.roles?.map(role => {
                  const colors = getRoleColor(role);
                  return (
                    <span key={role} className={`px-3 py-1 text-xs font-medium rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
                      {role.replace('_', ' ')}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center p-4 bg-slate-900/30 rounded-lg">
                <svg className="w-6 h-6 mx-auto mb-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
                </svg>
                <p className="text-2xl font-bold text-white">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/50">
            <h2 className="text-lg font-semibold text-white">Account Information</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
              <span className="text-slate-400">Full Name</span>
              <span className="text-white font-medium">{user?.name || 'Not set'}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
              <span className="text-slate-400">Username</span>
              <span className="text-white font-medium">@{user?.username}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-slate-700/50">
              <span className="text-slate-400">Email</span>
              <span className="text-white font-medium">{user?.email || 'user@bordersense.ai'}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-slate-400">Status</span>
              <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">Active</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700/50">
            <h2 className="text-lg font-semibold text-white">Activity</h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">Last Login</p>
                <p className="text-slate-500 text-xs">Today at 9:30 AM</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">Account Created</p>
                <p className="text-slate-500 text-xs">January 15, 2024</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">Two-Factor Auth</p>
                <p className="text-slate-500 text-xs">Enabled</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
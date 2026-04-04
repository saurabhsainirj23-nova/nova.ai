import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = (role) => {
    const demoUsers = {
      admin: { name: 'Admin User', username: 'admin', roles: ['ADMIN'] },
      commander: { name: 'Commander', username: 'commander', roles: ['COMMAND_CENTER'] },
      officer: { name: 'Field Officer', username: 'officer', roles: ['FIELD_OFFICER'] },
    };
    
    const demoUser = demoUsers[role];
    localStorage.setItem('access_token', 'demo-token');
    localStorage.setItem('refresh_token', 'demo-refresh');
    localStorage.setItem('user_data', JSON.stringify(demoUser));
    localStorage.setItem('token_timestamp', Date.now().toString());
    
    window.location.href = '/';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(username, password);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMtNi42MjcgMC0xMiA1LjM3My0xMiAxMnM1LjM3MyAxMiAxMiAxMiAxMi01LjM3MyAxMi0xMi01LjM3My0xMi0xMi0xMnptMCAxOGMtMy4zMTQgMC02LTIuNjg2LTYtNnMyLjY4Ni02IDYtNiA2IDIuNjg2IDYgNi0yLjY4NiA2LTYgNnoiIGZpbGw9IiMzMzQiIGZpbGwtb3BhY2l0eT0iLjA1Ii8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="relative w-full max-w-md">
        <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700/50 p-8 rounded-2xl shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-white">BorderSense AI</h1>
            <p className="text-slate-400 mt-2">Secure Border Monitoring System</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter password"
                required
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Signing in...
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600/50"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800 text-slate-400">Or try demo accounts</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-3">
              <button
                onClick={() => handleDemoLogin('admin')}
                className="py-2 px-3 bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/30 text-purple-400 text-sm font-medium rounded-lg transition-colors"
              >
                Admin
              </button>
              <button
                onClick={() => handleDemoLogin('commander')}
                className="py-2 px-3 bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 text-blue-400 text-sm font-medium rounded-lg transition-colors"
              >
                Commander
              </button>
              <button
                onClick={() => handleDemoLogin('officer')}
                className="py-2 px-3 bg-green-600/20 hover:bg-green-600/40 border border-green-500/30 text-green-400 text-sm font-medium rounded-lg transition-colors"
              >
                Officer
              </button>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-slate-500">
            <p>BorderSense AI v1.0.0 - Border Security System</p>
          </div>
        </div>
      </div>
    </div>
  );
}
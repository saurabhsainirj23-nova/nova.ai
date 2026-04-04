import { Navigate } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Access Denied</h1>
        <p className="text-slate-300">You don't have permission to access this page.</p>
        <a href="/" className="text-blue-400 hover:underline mt-4 inline-block">Go to Home</a>
      </div>
    </div>
  );
}
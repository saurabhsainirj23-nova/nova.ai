import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function AssetManagement() {
  const { hasRole } = useAuth();
  const [assets] = useState([
    { id: 1, name: 'Patrol Vehicle 1', type: 'Vehicle', status: 'Active' },
    { id: 2, name: 'Drone Unit A', type: 'Drone', status: 'Active' },
  ]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-4">Asset Management</h1>
      <div className="grid gap-4">
        {assets.map(asset => (
          <div key={asset.id} className="bg-slate-800 p-4 rounded-lg">
            <p className="text-white font-medium">{asset.name}</p>
            <p className="text-slate-400">{asset.type} - {asset.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
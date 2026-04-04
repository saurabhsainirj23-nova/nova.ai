// src/components/AssetManagement.jsx
import { useState, useEffect } from 'react';

const MOCK_ASSETS = [
  { _id: '1', name: 'Patrol Vehicle PV-001', type: 'Vehicle', status: 'Operational', deploymentRegion: 'Ladakh', healthScore: 0.95, maintenanceRisk: 0.1, nextScheduledMaintenance: '2026-05-15', serialNumber: 'PV-LK-001', purchaseDate: '2024-01-15', lastMaintenance: '2026-02-20' },
  { _id: '2', name: 'Patrol Vehicle PV-002', type: 'Vehicle', status: 'Operational', deploymentRegion: 'Ladakh', healthScore: 0.88, maintenanceRisk: 0.2, nextScheduledMaintenance: '2026-04-20', serialNumber: 'PV-LK-002', purchaseDate: '2024-02-10', lastMaintenance: '2026-01-15' },
  { _id: '3', name: 'Patrol Vehicle PV-003', type: 'Vehicle', status: 'Maintenance', deploymentRegion: 'Himachal', healthScore: 0.65, maintenanceRisk: 0.6, nextScheduledMaintenance: '2026-03-10', serialNumber: 'PV-HP-001', purchaseDate: '2023-08-20', lastMaintenance: '2026-02-01' },
  { _id: '4', name: 'Drone Unit DU-A1', type: 'Drone', status: 'Operational', deploymentRegion: 'Uttarakhand', healthScore: 0.92, maintenanceRisk: 0.15, nextScheduledMaintenance: '2026-06-01', serialNumber: 'DU-UK-001', purchaseDate: '2024-03-05', lastMaintenance: '2026-02-10' },
  { _id: '5', name: 'Drone Unit DU-A2', type: 'Drone', status: 'Operational', deploymentRegion: 'Sikkim', healthScore: 0.90, maintenanceRisk: 0.18, nextScheduledMaintenance: '2026-05-25', serialNumber: 'DU-SK-001', purchaseDate: '2024-04-12', lastMaintenance: '2026-01-20' },
  { _id: '6', name: 'Drone Unit DU-B1', type: 'Drone', status: 'Deployed', deploymentRegion: 'Arunachal', healthScore: 0.85, maintenanceRisk: 0.25, nextScheduledMaintenance: '2026-04-15', serialNumber: 'DU-AP-001', purchaseDate: '2023-11-08', lastMaintenance: '2026-02-25' },
  { _id: '7', name: 'Surveillance Camera SC-001', type: 'Camera', status: 'Operational', deploymentRegion: 'Ladakh', healthScore: 0.98, maintenanceRisk: 0.05, nextScheduledMaintenance: '2026-07-01', serialNumber: 'SC-LK-001', purchaseDate: '2023-05-18', lastMaintenance: '2026-02-28' },
  { _id: '8', name: 'Surveillance Camera SC-002', type: 'Camera', status: 'Operational', deploymentRegion: 'Himachal', healthScore: 0.94, maintenanceRisk: 0.12, nextScheduledMaintenance: '2026-06-15', serialNumber: 'SC-HP-001', purchaseDate: '2023-06-22', lastMaintenance: '2026-01-10' },
  { _id: '9', name: 'Surveillance Camera SC-003', type: 'Camera', status: 'Offline', deploymentRegion: 'Uttarakhand', healthScore: 0.40, maintenanceRisk: 0.85, nextScheduledMaintenance: '2026-03-05', serialNumber: 'SC-UK-002', purchaseDate: '2022-12-14', lastMaintenance: '2026-02-01' },
  { _id: '10', name: 'Thermal Sensor TS-001', type: 'Sensor', status: 'Operational', deploymentRegion: 'Ladakh', healthScore: 0.91, maintenanceRisk: 0.14, nextScheduledMaintenance: '2026-05-30', serialNumber: 'TS-LK-001', purchaseDate: '2024-01-25', lastMaintenance: '2026-02-15' },
  { _id: '11', name: 'Thermal Sensor TS-002', type: 'Sensor', status: 'Operational', deploymentRegion: 'Sikkim', healthScore: 0.89, maintenanceRisk: 0.19, nextScheduledMaintenance: '2026-05-20', serialNumber: 'TS-SK-001', purchaseDate: '2024-02-28', lastMaintenance: '2026-01-25' },
  { _id: '12', name: 'Radio Set RS-001', type: 'Radio', status: 'Operational', deploymentRegion: 'Ladakh', healthScore: 0.96, maintenanceRisk: 0.08, nextScheduledMaintenance: '2026-08-01', serialNumber: 'RS-LK-001', purchaseDate: '2023-09-10', lastMaintenance: '2026-02-20' },
  { _id: '13', name: 'Radio Set RS-002', type: 'Radio', status: 'Operational', deploymentRegion: 'Arunachal', healthScore: 0.93, maintenanceRisk: 0.11, nextScheduledMaintenance: '2026-07-15', serialNumber: 'RS-AP-001', purchaseDate: '2023-10-05', lastMaintenance: '2026-01-30' },
  { _id: '14', name: 'Radio Set RS-003', type: 'Radio', status: 'Maintenance', deploymentRegion: 'Himachal', healthScore: 0.70, maintenanceRisk: 0.55, nextScheduledMaintenance: '2026-03-20', serialNumber: 'RS-HP-001', purchaseDate: '2023-04-18', lastMaintenance: '2026-02-05' },
  { _id: '15', name: 'Generator GEN-001', type: 'Generator', status: 'Operational', deploymentRegion: 'Ladakh', healthScore: 0.87, maintenanceRisk: 0.22, nextScheduledMaintenance: '2026-04-30', serialNumber: 'GEN-LK-001', purchaseDate: '2023-07-12', lastMaintenance: '2026-02-10' },
  { _id: '16', name: 'Generator GEN-002', type: 'Generator', status: 'Operational', deploymentRegion: 'Uttarakhand', healthScore: 0.84, maintenanceRisk: 0.28, nextScheduledMaintenance: '2026-05-10', serialNumber: 'GEN-UK-001', purchaseDate: '2023-08-25', lastMaintenance: '2026-01-20' },
  { _id: '17', name: 'Patrol Vehicle PV-004', type: 'Vehicle', status: 'Operational', deploymentRegion: 'Sikkim', healthScore: 0.91, maintenanceRisk: 0.16, nextScheduledMaintenance: '2026-06-01', serialNumber: 'PV-SK-001', purchaseDate: '2024-03-15', lastMaintenance: '2026-02-25' },
  { _id: '18', name: 'Drone Unit DU-C1', type: 'Drone', status: 'Operational', deploymentRegion: 'Ladakh', healthScore: 0.93, maintenanceRisk: 0.13, nextScheduledMaintenance: '2026-06-10', serialNumber: 'DU-LK-002', purchaseDate: '2024-05-20', lastMaintenance: '2026-02-18' },
  { _id: '19', name: 'Surveillance Camera SC-004', type: 'Camera', status: 'Operational', deploymentRegion: 'Arunachal', healthScore: 0.96, maintenanceRisk: 0.07, nextScheduledMaintenance: '2026-07-20', serialNumber: 'SC-AP-001', purchaseDate: '2023-12-08', lastMaintenance: '2026-02-28' },
  { _id: '20', name: 'Thermal Sensor TS-003', type: 'Sensor', status: 'Deployed', deploymentRegion: 'Himachal', healthScore: 0.82, maintenanceRisk: 0.30, nextScheduledMaintenance: '2026-04-25', serialNumber: 'TS-HP-001', purchaseDate: '2024-01-10', lastMaintenance: '2026-01-15' },
];

const assetTypes = ['Vehicle', 'Drone', 'Camera', 'Sensor', 'Radio', 'Generator'];
const assetStatuses = ['Operational', 'Maintenance', 'Offline', 'Deployed'];
const regions = ['Ladakh', 'Himachal', 'Uttarakhand', 'Sikkim', 'Arunachal'];

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

const AssetManagement = () => {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ type: '', status: '', region: '' });
  const [pagination, setPagination] = useState({ page: 1, perPage: 10, total: 0, totalPages: 0 });
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [addForm, setAddForm] = useState({ name: '', type: 'Vehicle', status: 'Operational', deploymentRegion: 'Ladakh', serialNumber: '' });

  useEffect(() => {
    fetchAssets();
  }, [filters, pagination.page, pagination.perPage]);

  const fetchAssets = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    let filtered = [...MOCK_ASSETS];
    if (filters.type) filtered = filtered.filter(a => a.type === filters.type);
    if (filters.status) filtered = filtered.filter(a => a.status === filters.status);
    if (filters.region) filtered = filtered.filter(a => a.deploymentRegion === filters.region);
    const total = filtered.length;
    const totalPages = Math.ceil(total / pagination.perPage);
    const start = (pagination.page - 1) * pagination.perPage;
    const paginated = filtered.slice(start, start + pagination.perPage);
    setAssets(paginated);
    setPagination(p => ({ ...p, total, totalPages }));
    setLoading(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
    setPagination({ ...pagination, page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setPagination({ ...pagination, page: newPage });
  };

  const getRiskColor = (risk) => {
    if (risk >= 0.7) return '#ef4444';
    if (risk >= 0.4) return '#f97316';
    return '#22c55e';
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Operational': return 'status-operational';
      case 'Maintenance': return 'status-maintenance';
      case 'Offline': return 'status-offline';
      case 'Deployed': return 'status-deployed';
      default: return '';
    }
  };

  const handleView = (asset) => {
    setSelectedAsset(asset);
    setIsViewModalOpen(true);
  };

  const handleEdit = (asset) => {
    setSelectedAsset(asset);
    setEditForm({ ...asset });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setAssets(assets.map(a => a._id === editForm._id ? editForm : a));
    setIsEditModalOpen(false);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newAsset = {
      ...addForm,
      _id: String(MOCK_ASSETS.length + 1),
      healthScore: 1,
      maintenanceRisk: 0,
      nextScheduledMaintenance: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      purchaseDate: new Date().toISOString().split('T')[0],
      lastMaintenance: new Date().toISOString().split('T')[0],
    };
    MOCK_ASSETS.push(newAsset);
    setAddForm({ name: '', type: 'Vehicle', status: 'Operational', deploymentRegion: 'Ladakh', serialNumber: '' });
    fetchAssets();
    setIsAddModalOpen(false);
  };

  const handleExport = () => {
    const headers = ['Name', 'Type', 'Status', 'Region', 'Health', 'Risk', 'Next Maintenance', 'Serial Number'];
    const rows = MOCK_ASSETS.map(a => [
      a.name, a.type, a.status, a.deploymentRegion,
      Math.round(a.healthScore * 100) + '%', Math.round(a.maintenanceRisk * 100) + '%',
      a.nextScheduledMaintenance, a.serialNumber
    ]);
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'assets_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="asset-management">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Asset Management</h1>
          <p className="text-slate-400 mt-1">Monitor and manage all border security assets</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors" onClick={() => setIsAddModalOpen(true)}>
            + Add Asset
          </button>
          <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg border border-slate-600 transition-colors" onClick={handleExport}>
            Export List
          </button>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 mb-6">
        <div className="filters flex flex-wrap gap-4">
          <div className="filter-group">
            <label htmlFor="type">Asset Type:</label>
            <select id="type" name="type" value={filters.type} onChange={handleFilterChange}>
              <option value="">All Types</option>
              {assetTypes.map((type) => (<option key={type} value={type}>{type}</option>))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="status">Status:</label>
            <select id="status" name="status" value={filters.status} onChange={handleFilterChange}>
              <option value="">All Statuses</option>
              {assetStatuses.map((status) => (<option key={status} value={status}>{status}</option>))}
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="region">Region:</label>
            <select id="region" name="region" value={filters.region} onChange={handleFilterChange}>
              <option value="">All Regions</option>
              {regions.map((region) => (<option key={region} value={region}>{region}</option>))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading assets...</div>
        ) : (
          <>
            <table className="assets-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Region</th>
                  <th>Health</th>
                  <th>Risk</th>
                  <th>Next Maintenance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {assets.length === 0 ? (
                  <tr><td colSpan="8" className="no-data">No assets found.</td></tr>
                ) : (
                  assets.map((asset) => (
                    <tr key={asset._id}>
                      <td className="font-medium text-white">{asset.name}</td>
                      <td>{asset.type}</td>
                      <td><span className={`status-badge ${getStatusClass(asset.status)}`}>{asset.status}</span></td>
                      <td>{asset.deploymentRegion}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${asset.healthScore * 100}%` }} />
                          </div>
                          <span className="text-xs">{Math.round(asset.healthScore * 100)}%</span>
                        </div>
                      </td>
                      <td><div className="risk-indicator" style={{ backgroundColor: getRiskColor(asset.maintenanceRisk) }}>{Math.round(asset.maintenanceRisk * 100)}%</div></td>
                      <td>{asset.nextScheduledMaintenance}</td>
                      <td>
                        <button className="btn-view" onClick={() => handleView(asset)}>View</button>
                        <button className="btn-edit" onClick={() => handleEdit(asset)}>Edit</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="pagination">
              <button onClick={() => handlePageChange(1)} disabled={pagination.page === 1}>&laquo;</button>
              <button onClick={() => handlePageChange(pagination.page - 1)} disabled={pagination.page === 1}>&lt;</button>
              <span>Page {pagination.page} of {pagination.totalPages}</span>
              <button onClick={() => handlePageChange(pagination.page + 1)} disabled={pagination.page === pagination.totalPages}>&gt;</button>
              <button onClick={() => handlePageChange(pagination.totalPages)} disabled={pagination.page === pagination.totalPages}>&raquo;</button>
            </div>
          </>
        )}
      </div>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Asset Details">
        {selectedAsset && (
          <div className="asset-details">
            <div className="detail-row"><span className="detail-label">Name:</span><span className="detail-value">{selectedAsset.name}</span></div>
            <div className="detail-row"><span className="detail-label">Type:</span><span className="detail-value">{selectedAsset.type}</span></div>
            <div className="detail-row"><span className="detail-label">Status:</span><span className={`status-badge ${getStatusClass(selectedAsset.status)}`}>{selectedAsset.status}</span></div>
            <div className="detail-row"><span className="detail-label">Region:</span><span className="detail-value">{selectedAsset.deploymentRegion}</span></div>
            <div className="detail-row"><span className="detail-label">Serial Number:</span><span className="detail-value">{selectedAsset.serialNumber}</span></div>
            <div className="detail-row"><span className="detail-label">Health Score:</span><span className="detail-value">{Math.round(selectedAsset.healthScore * 100)}%</span></div>
            <div className="detail-row"><span className="detail-label">Maintenance Risk:</span><span className="detail-value" style={{ color: getRiskColor(selectedAsset.maintenanceRisk) }}>{Math.round(selectedAsset.maintenanceRisk * 100)}%</span></div>
            <div className="detail-row"><span className="detail-label">Next Maintenance:</span><span className="detail-value">{selectedAsset.nextScheduledMaintenance}</span></div>
            <div className="detail-row"><span className="detail-label">Last Maintenance:</span><span className="detail-value">{selectedAsset.lastMaintenance}</span></div>
            <div className="detail-row"><span className="detail-label">Purchase Date:</span><span className="detail-value">{selectedAsset.purchaseDate}</span></div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Asset">
        <form onSubmit={handleEditSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input className="form-input" value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-input" value={editForm.type || ''} onChange={e => setEditForm({ ...editForm, type: e.target.value })}>
              {assetTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-input" value={editForm.status || ''} onChange={e => setEditForm({ ...editForm, status: e.target.value })}>
              {assetStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Region</label>
            <select className="form-input" value={editForm.deploymentRegion || ''} onChange={e => setEditForm({ ...editForm, deploymentRegion: e.target.value })}>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Serial Number</label>
            <input className="form-input" value={editForm.serialNumber || ''} onChange={e => setEditForm({ ...editForm, serialNumber: e.target.value })} required />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save Changes</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Asset">
        <form onSubmit={handleAddSubmit}>
          <div className="form-group">
            <label className="form-label">Asset Name</label>
            <input className="form-input" value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} placeholder="Enter asset name" required />
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select className="form-input" value={addForm.type} onChange={e => setAddForm({ ...addForm, type: e.target.value })}>
              {assetTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-input" value={addForm.status} onChange={e => setAddForm({ ...addForm, status: e.target.value })}>
              {assetStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Region</label>
            <select className="form-input" value={addForm.deploymentRegion} onChange={e => setAddForm({ ...addForm, deploymentRegion: e.target.value })}>
              {regions.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Serial Number</label>
            <input className="form-input" value={addForm.serialNumber} onChange={e => setAddForm({ ...addForm, serialNumber: e.target.value })} placeholder="Enter serial number" required />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Add Asset</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AssetManagement;

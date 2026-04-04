import { useState, useEffect } from 'react';

const MOCK_OFFICERS = [
  { _id: '1', name: 'Commandant Rajesh Kumar', username: 'cmd_kumar', email: 'r.kumar@itbp.gov.in', role: 'COMMAND_CENTER', phone: '+91-9876543201', region: 'Ladakh', status: 'Active', joinDate: '2018-05-15' },
  { _id: '2', name: 'Subedar Major Suresh Singh', username: 'ss_singh', email: 's.singh@itbp.gov.in', role: 'FIELD_OFFICER', phone: '+91-9876543202', region: 'Himachal', status: 'Active', joinDate: '2015-03-22' },
  { _id: '3', name: 'Inspector Anil Sharma', username: 'ins_sharma', email: 'a.sharma@itbp.gov.in', role: 'FIELD_OFFICER', phone: '+91-9876543203', region: 'Uttarakhand', status: 'Active', joinDate: '2019-08-10' },
  { _id: '4', name: 'Deputy Commandant Priya Patel', username: 'dc_patel', email: 'p.patel@itbp.gov.in', role: 'COMMAND_CENTER', phone: '+91-9876543204', region: 'Sikkim', status: 'Active', joinDate: '2017-11-05' },
  { _id: '5', name: 'Head Constable Ramesh Gupta', username: 'hc_gupta', email: 'r.gupta@itbp.gov.in', role: 'FIELD_OFFICER', phone: '+91-9876543205', region: 'Arunachal', status: 'Active', joinDate: '2020-02-18' },
  { _id: '6', name: 'Commandant (Retd.) Vikram Singh', username: 'cmd_singh', email: 'v.singh@itbp.gov.in', role: 'ADMIN', phone: '+91-9876543206', region: 'HQ', status: 'Active', joinDate: '2012-07-25' },
  { _id: '7', name: 'SI Arun Joshi', username: 'si_joshi', email: 'a.joshi@itbp.gov.in', role: 'FIELD_OFFICER', phone: '+91-9876543207', region: 'Ladakh', status: 'On Leave', joinDate: '2021-01-10' },
  { _id: '8', name: 'Inspector Mohd. Rashid', username: 'ins_rashid', email: 'm.rashid@itbp.gov.in', role: 'FIELD_OFFICER', phone: '+91-9876543208', region: 'Himachal', status: 'Active', joinDate: '2018-09-14' },
  { _id: '9', name: 'DIG Sunil Verma', username: 'dig_verma', email: 's.verma@itbp.gov.in', role: 'COMMAND_CENTER', phone: '+91-9876543209', region: 'HQ', status: 'Active', joinDate: '2010-04-20' },
  { _id: '10', name: 'Constable Dilip Kumar', username: 'con_kumar', email: 'd.kumar@itbp.gov.in', role: 'FIELD_OFFICER', phone: '+91-9876543210', region: 'Uttarakhand', status: 'Active', joinDate: '2022-06-08' },
];

const ROLES = ['ADMIN', 'COMMAND_CENTER', 'FIELD_OFFICER'];
const REGIONS = ['Ladakh', 'Himachal', 'Uttarakhand', 'Sikkim', 'Arunachal', 'HQ'];

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

export default function OfficerManagement() {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ role: '', status: '', search: '' });
  const [selectedOfficer, setSelectedOfficer] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [addForm, setAddForm] = useState({ name: '', username: '', email: '', role: 'FIELD_OFFICER', phone: '', region: 'Ladakh' });

  useEffect(() => {
    fetchOfficers();
  }, [filter]);

  const fetchOfficers = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    let filtered = [...MOCK_OFFICERS];
    if (filter.role) filtered = filtered.filter(o => o.role === filter.role);
    if (filter.status) filtered = filtered.filter(o => o.status === filter.status);
    if (filter.search) {
      const s = filter.search.toLowerCase();
      filtered = filtered.filter(o => o.name.toLowerCase().includes(s) || o.username.toLowerCase().includes(s) || o.email.toLowerCase().includes(s));
    }
    setOfficers(filtered);
    setLoading(false);
  };

  const handleView = (officer) => {
    setSelectedOfficer(officer);
    setIsViewModalOpen(true);
  };

  const handleEdit = (officer) => {
    setSelectedOfficer(officer);
    setEditForm({ ...officer });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    setOfficers(officers.map(o => o._id === editForm._id ? editForm : o));
    setIsEditModalOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this officer?')) {
      setOfficers(officers.filter(o => o._id !== id));
    }
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const newOfficer = {
      ...addForm,
      _id: String(MOCK_OFFICERS.length + 1),
      status: 'Active',
      joinDate: new Date().toISOString().split('T')[0],
    };
    MOCK_OFFICERS.push(newOfficer);
    setAddForm({ name: '', username: '', email: '', role: 'FIELD_OFFICER', phone: '', region: 'Ladakh' });
    fetchOfficers();
    setIsAddModalOpen(false);
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'ADMIN': return 'role-admin';
      case 'COMMAND_CENTER': return 'role-commander';
      case 'FIELD_OFFICER': return 'role-officer';
      default: return '';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active': return 'status-active';
      case 'On Leave': return 'status-leave';
      case 'Inactive': return 'status-inactive';
      default: return '';
    }
  };

  return (
    <div className="officer-management">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Officer Management</h1>
          <p className="text-slate-400 mt-1">Manage ITBP officers and their access permissions</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors" onClick={() => setIsAddModalOpen(true)}>
          + Add Officer
        </button>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 mb-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search by name, username, or email..."
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <select
            value={filter.role}
            onChange={(e) => setFilter(prev => ({ ...prev, role: e.target.value }))}
            className="px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="">All Roles</option>
            {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
          </select>
          <select
            value={filter.status}
            onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
            className="px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading officers...</div>
        ) : (
          <table className="officers-table">
            <thead>
              <tr>
                <th>Officer</th>
                <th>Role</th>
                <th>Region</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {officers.length === 0 ? (
                <tr><td colSpan="6" className="no-data">No officers found.</td></tr>
              ) : (
                officers.map((officer) => (
                  <tr key={officer._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-medium">
                          {officer.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-white">{officer.name}</p>
                          <p className="text-xs text-slate-500">{officer.email}</p>
                        </div>
                      </div>
                    </td>
                    <td><span className={`role-badge ${getRoleBadge(officer.role)}`}>{officer.role.replace('_', ' ')}</span></td>
                    <td>{officer.region}</td>
                    <td className="text-slate-400">{officer.phone}</td>
                    <td><span className={`status-badge ${getStatusBadge(officer.status)}`}>{officer.status}</span></td>
                    <td>
                      <div className="flex gap-2">
                        <button className="btn-action btn-view" onClick={() => handleView(officer)}>View</button>
                        <button className="btn-action btn-edit" onClick={() => handleEdit(officer)}>Edit</button>
                        <button className="btn-action btn-delete" onClick={() => handleDelete(officer._id)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Officer Details">
        {selectedOfficer && (
          <div className="officer-details">
            <div className="detail-avatar">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-3xl font-bold">
                {selectedOfficer.name.charAt(0)}
              </div>
              <h3 className="text-white font-semibold mt-3">{selectedOfficer.name}</h3>
              <p className="text-slate-400 text-sm">{selectedOfficer.email}</p>
            </div>
            <div className="detail-row"><span className="detail-label">Username:</span><span className="detail-value">{selectedOfficer.username}</span></div>
            <div className="detail-row"><span className="detail-label">Role:</span><span className={`role-badge ${getRoleBadge(selectedOfficer.role)}`}>{selectedOfficer.role.replace('_', ' ')}</span></div>
            <div className="detail-row"><span className="detail-label">Region:</span><span className="detail-value">{selectedOfficer.region}</span></div>
            <div className="detail-row"><span className="detail-label">Phone:</span><span className="detail-value">{selectedOfficer.phone}</span></div>
            <div className="detail-row"><span className="detail-label">Status:</span><span className={`status-badge ${getStatusBadge(selectedOfficer.status)}`}>{selectedOfficer.status}</span></div>
            <div className="detail-row"><span className="detail-label">Join Date:</span><span className="detail-value">{selectedOfficer.joinDate}</span></div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Officer">
        <form onSubmit={handleEditSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={editForm.name || ''} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" value={editForm.username || ''} onChange={e => setEditForm({ ...editForm, username: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={editForm.email || ''} onChange={e => setEditForm({ ...editForm, email: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-input" value={editForm.role || ''} onChange={e => setEditForm({ ...editForm, role: e.target.value })}>
              {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Region</label>
            <select className="form-input" value={editForm.region || ''} onChange={e => setEditForm({ ...editForm, region: e.target.value })}>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-input" value={editForm.phone || ''} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} required />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Save Changes</button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Officer">
        <form onSubmit={handleAddSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input className="form-input" value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })} placeholder="Enter full name" required />
          </div>
          <div className="form-group">
            <label className="form-label">Username</label>
            <input className="form-input" value={addForm.username} onChange={e => setAddForm({ ...addForm, username: e.target.value })} placeholder="Enter username" required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" value={addForm.email} onChange={e => setAddForm({ ...addForm, email: e.target.value })} placeholder="Enter email" required />
          </div>
          <div className="form-group">
            <label className="form-label">Role</label>
            <select className="form-input" value={addForm.role} onChange={e => setAddForm({ ...addForm, role: e.target.value })}>
              {ROLES.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Region</label>
            <select className="form-input" value={addForm.region} onChange={e => setAddForm({ ...addForm, region: e.target.value })}>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Phone</label>
            <input className="form-input" value={addForm.phone} onChange={e => setAddForm({ ...addForm, phone: e.target.value })} placeholder="Enter phone number" required />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Add Officer</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

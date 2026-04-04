import { useState, useEffect } from 'react';

const MOCK_OFFICERS = [
  { _id: '1', name: 'Commandant Rajesh Kumar', role: 'COMMAND_CENTER' },
  { _id: '2', name: 'Subedar Major Suresh Singh', role: 'FIELD_OFFICER' },
  { _id: '3', name: 'Inspector Anil Sharma', role: 'FIELD_OFFICER' },
  { _id: '4', name: 'Deputy Commandant Priya Patel', role: 'COMMAND_CENTER' },
  { _id: '5', name: 'Head Constable Ramesh Gupta', role: 'FIELD_OFFICER' },
  { _id: '7', name: 'SI Arun Joshi', role: 'FIELD_OFFICER' },
  { _id: '8', name: 'Inspector Mohd. Rashid', role: 'FIELD_OFFICER' },
  { _id: '10', name: 'Constable Dilip Kumar', role: 'FIELD_OFFICER' },
];

const MOCK_DUTIES = [
  { _id: '1', title: 'Border Patrol - Sector A', type: 'Patrolling', assignedTo: '2', region: 'Ladakh', shift: 'Morning', date: '2026-04-03', status: 'active', priority: 'high', description: 'Routine patrol along the border fence in Sector A', startTime: '06:00', endTime: '14:00' },
  { _id: '2', title: 'Checkpoint Duty - Checkpoint 7', type: 'Surveillance', assignedTo: '3', region: 'Himachal', shift: 'Afternoon', date: '2026-04-03', status: 'active', priority: 'medium', description: 'Monitor and verify vehicles at checkpoint 7', startTime: '14:00', endTime: '22:00' },
  { _id: '3', title: 'Escort Duty - Supply Convoy', type: 'Escort', assignedTo: '5', region: 'Uttarakhand', shift: 'Night', date: '2026-04-03', status: 'pending', priority: 'high', description: 'Escort supply convoy from Joshimath to Nanda Devi base', startTime: '22:00', endTime: '06:00' },
  { _id: '4', title: 'Surveillance - Valley Sector', type: 'Surveillance', assignedTo: '7', region: 'Sikkim', shift: 'Morning', date: '2026-04-04', status: 'scheduled', priority: 'medium', description: '24-hour surveillance of the valley sector', startTime: '06:00', endTime: '06:00' },
  { _id: '5', title: 'Border Patrol - Sector B', type: 'Patrolling', assignedTo: '8', region: 'Arunachal', shift: 'Afternoon', date: '2026-04-04', status: 'scheduled', priority: 'low', description: 'Routine patrol along the border in Sector B', startTime: '14:00', endTime: '22:00' },
  { _id: '6', title: 'Training Session', type: 'Training', assignedTo: '10', region: 'HQ', shift: 'Morning', date: '2026-04-05', status: 'scheduled', priority: 'low', description: 'New recruits training on equipment usage', startTime: '09:00', endTime: '17:00' },
];

const TASK_TYPES = ['Patrolling', 'Surveillance', 'Escort', 'Training', 'Medical', 'Logistics'];
const SHIFTS = ['Morning', 'Afternoon', 'Night'];
const REGIONS = ['Ladakh', 'Himachal', 'Uttarakhand', 'Sikkim', 'Arunachal', 'HQ'];
const PRIORITIES = ['low', 'medium', 'high', 'critical'];

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

export default function DutyAssignment() {
  const [duties, setDuties] = useState(MOCK_DUTIES);
  const [officers] = useState(MOCK_OFFICERS);
  const [filter, setFilter] = useState({ status: '', type: '', date: '' });
  const [selectedDuty, setSelectedDuty] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignForm, setAssignForm] = useState({ title: '', type: 'Patrolling', region: 'Ladakh', shift: 'Morning', date: new Date().toISOString().split('T')[0], priority: 'medium', description: '', assignedTo: '', startTime: '06:00', endTime: '14:00' });

  const handleView = (duty) => {
    setSelectedDuty(duty);
    setIsViewModalOpen(true);
  };

  const handleStatusChange = (dutyId, newStatus) => {
    setDuties(duties.map(d => d._id === dutyId ? { ...d, status: newStatus } : d));
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    const newDuty = {
      ...assignForm,
      _id: String(duties.length + 1),
      status: 'scheduled',
    };
    setDuties([...duties, newDuty]);
    setAssignForm({ title: '', type: 'Patrolling', region: 'Ladakh', shift: 'Morning', date: new Date().toISOString().split('T')[0], priority: 'medium', description: '', assignedTo: '', startTime: '06:00', endTime: '14:00' });
    setIsAssignModalOpen(false);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this duty?')) {
      setDuties(duties.filter(d => d._id !== id));
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'critical': return 'priority-critical';
      case 'high': return 'priority-high';
      case 'medium': return 'priority-medium';
      case 'low': return 'priority-low';
      default: return '';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'scheduled': return 'status-scheduled';
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      default: return '';
    }
  };

  const getOfficerName = (id) => {
    const officer = officers.find(o => o._id === id);
    return officer ? officer.name : 'Unassigned';
  };

  const filteredDuties = duties.filter(duty => {
    if (filter.status && duty.status !== filter.status) return false;
    if (filter.type && duty.type !== filter.type) return false;
    if (filter.date && duty.date !== filter.date) return false;
    return true;
  });

  const stats = {
    active: duties.filter(d => d.status === 'active').length,
    scheduled: duties.filter(d => d.status === 'scheduled').length,
    pending: duties.filter(d => d.status === 'pending').length,
    completed: duties.filter(d => d.status === 'completed').length,
  };

  return (
    <div className="duty-assignment">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Assign Duty</h1>
          <p className="text-slate-400 mt-1">Assign tasks, patrol shifts, and track duty completion</p>
        </div>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors" onClick={() => setIsAssignModalOpen(true)}>
          + Assign New Duty
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <p className="text-sm text-slate-400">Active</p>
          <p className="text-2xl font-bold text-white">{stats.active}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <p className="text-sm text-slate-400">Scheduled</p>
          <p className="text-2xl font-bold text-white">{stats.scheduled}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <p className="text-sm text-slate-400">Pending</p>
          <p className="text-2xl font-bold text-white">{stats.pending}</p>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
          <p className="text-sm text-slate-400">Completed</p>
          <p className="text-2xl font-bold text-white">{stats.completed}</p>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 mb-6">
        <div className="flex flex-wrap gap-4">
          <select
            value={filter.status}
            onChange={(e) => setFilter(prev => ({ ...prev, status: e.target.value }))}
            className="px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="scheduled">Scheduled</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={filter.type}
            onChange={(e) => setFilter(prev => ({ ...prev, type: e.target.value }))}
            className="px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="">All Types</option>
            {TASK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <input
            type="date"
            value={filter.date}
            onChange={(e) => setFilter(prev => ({ ...prev, date: e.target.value }))}
            className="px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
        <table className="duties-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Type</th>
              <th>Assigned To</th>
              <th>Region</th>
              <th>Shift</th>
              <th>Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDuties.length === 0 ? (
              <tr><td colSpan="9" className="no-data">No duties found.</td></tr>
            ) : (
              filteredDuties.map((duty) => (
                <tr key={duty._id}>
                  <td className="font-medium text-white">{duty.title}</td>
                  <td>{duty.type}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white text-xs">
                        {getOfficerName(duty.assignedTo).charAt(0)}
                      </div>
                      <span className="text-sm">{getOfficerName(duty.assignedTo)}</span>
                    </div>
                  </td>
                  <td>{duty.region}</td>
                  <td>{duty.shift}</td>
                  <td className="text-slate-400">{duty.date}</td>
                  <td><span className={`priority-badge ${getPriorityBadge(duty.priority)}`}>{duty.priority}</span></td>
                  <td><span className={`status-badge ${getStatusBadge(duty.status)}`}>{duty.status}</span></td>
                  <td>
                    <div className="flex gap-2">
                      <button className="btn-action btn-view" onClick={() => handleView(duty)}>View</button>
                      {duty.status === 'scheduled' && (
                        <button className="btn-action btn-primary-sm" onClick={() => handleStatusChange(duty._id, 'active')}>Start</button>
                      )}
                      {duty.status === 'active' && (
                        <button className="btn-action btn-success-sm" onClick={() => handleStatusChange(duty._id, 'completed')}>Complete</button>
                      )}
                      <button className="btn-action btn-delete" onClick={() => handleDelete(duty._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Duty Details">
        {selectedDuty && (
          <div className="duty-details">
            <div className="detail-row"><span className="detail-label">Task:</span><span className="detail-value">{selectedDuty.title}</span></div>
            <div className="detail-row"><span className="detail-label">Type:</span><span className="detail-value">{selectedDuty.type}</span></div>
            <div className="detail-row"><span className="detail-label">Assigned To:</span><span className="detail-value">{getOfficerName(selectedDuty.assignedTo)}</span></div>
            <div className="detail-row"><span className="detail-label">Region:</span><span className="detail-value">{selectedDuty.region}</span></div>
            <div className="detail-row"><span className="detail-label">Shift:</span><span className="detail-value">{selectedDuty.shift}</span></div>
            <div className="detail-row"><span className="detail-label">Time:</span><span className="detail-value">{selectedDuty.startTime} - {selectedDuty.endTime}</span></div>
            <div className="detail-row"><span className="detail-label">Date:</span><span className="detail-value">{selectedDuty.date}</span></div>
            <div className="detail-row"><span className="detail-label">Priority:</span><span className={`priority-badge ${getPriorityBadge(selectedDuty.priority)}`}>{selectedDuty.priority}</span></div>
            <div className="detail-row"><span className="detail-label">Status:</span><span className={`status-badge ${getStatusBadge(selectedDuty.status)}`}>{selectedDuty.status}</span></div>
            <div className="detail-row"><span className="detail-label">Description:</span><span className="detail-value">{selectedDuty.description}</span></div>
          </div>
        )}
      </Modal>

      <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title="Assign New Duty">
        <form onSubmit={handleAssignSubmit}>
          <div className="form-group">
            <label className="form-label">Task Title</label>
            <input className="form-input" value={assignForm.title} onChange={e => setAssignForm({ ...assignForm, title: e.target.value })} placeholder="Enter task title" required />
          </div>
          <div className="form-group">
            <label className="form-label">Task Type</label>
            <select className="form-input" value={assignForm.type} onChange={e => setAssignForm({ ...assignForm, type: e.target.value })}>
              {TASK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Assign To</label>
            <select className="form-input" value={assignForm.assignedTo} onChange={e => setAssignForm({ ...assignForm, assignedTo: e.target.value })} required>
              <option value="">Select Officer</option>
              {officers.filter(o => o.role === 'FIELD_OFFICER').map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Region</label>
            <select className="form-input" value={assignForm.region} onChange={e => setAssignForm({ ...assignForm, region: e.target.value })}>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Shift</label>
            <select className="form-input" value={assignForm.shift} onChange={e => setAssignForm({ ...assignForm, shift: e.target.value })}>
              {SHIFTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Start Time</label>
              <input className="form-input" type="time" value={assignForm.startTime} onChange={e => setAssignForm({ ...assignForm, startTime: e.target.value })} required />
            </div>
            <div className="form-group">
              <label className="form-label">End Time</label>
              <input className="form-input" type="time" value={assignForm.endTime} onChange={e => setAssignForm({ ...assignForm, endTime: e.target.value })} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Date</label>
            <input className="form-input" type="date" value={assignForm.date} onChange={e => setAssignForm({ ...assignForm, date: e.target.value })} required />
          </div>
          <div className="form-group">
            <label className="form-label">Priority</label>
            <select className="form-input" value={assignForm.priority} onChange={e => setAssignForm({ ...assignForm, priority: e.target.value })}>
              {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-input" value={assignForm.description} onChange={e => setAssignForm({ ...assignForm, description: e.target.value })} placeholder="Enter task description" rows={3} required />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={() => setIsAssignModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">Assign Duty</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

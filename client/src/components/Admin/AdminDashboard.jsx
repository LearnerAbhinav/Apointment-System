import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Mail, MoreVertical, CheckCircle, XCircle, Trash2, Filter } from 'lucide-react';
import { appointmentService } from '../../services/api';

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', date: '' });

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentService.getAll(filter);
      setAppointments(response.data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [filter]);

  const handleStatusUpdate = async (id, status) => {
    try {
      await appointmentService.updateStatus(id, status);
      fetchAppointments();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      await appointmentService.delete(id);
      fetchAppointments();
    } catch (error) {
      alert('Failed to delete');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-emerald-400 bg-emerald-400/10';
      case 'cancelled': return 'text-rose-400 bg-rose-400/10';
      case 'completed': return 'text-indigo-400 bg-indigo-400/10';
      default: return 'text-amber-400 bg-amber-400/10';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6">
        <div>
          <h1 className="text-2xl font-semibold text-white">Appointments</h1>
          <p className="text-slate-400 text-sm">Manage and track all booking requests</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
            <Filter size={16} className="text-slate-500" />
            <select 
              className="bg-transparent text-sm text-slate-300 focus:outline-none"
              value={filter.status}
              onChange={(e) => setFilter({...filter, status: e.target.value})}
            >
              <option value="">All Status</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2">
            <Calendar size={16} className="text-slate-500" />
            <input 
              type="date" 
              className="bg-transparent text-sm text-slate-300 focus:outline-none"
              value={filter.date}
              onChange={(e) => setFilter({...filter, date: e.target.value})}
            />
          </div>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Schedule</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider">Reason</th>
                <th className="px-6 py-4 text-xs font-medium text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-500">Loading appointments...</td></tr>
              ) : appointments.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-10 text-center text-slate-500">No appointments found.</td></tr>
              ) : (
                appointments.map((apt) => (
                  <tr key={apt._id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white">{apt.name}</span>
                        <span className="text-xs text-slate-500">{apt.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col text-sm text-slate-300">
                        <span className="flex items-center gap-2"><Calendar size={12} /> {apt.date}</span>
                        <span className="flex items-center gap-2"><Clock size={12} /> {apt.time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(apt.status)}`}>
                        {apt.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-[200px] truncate text-sm text-slate-400">
                      {apt.reason}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {apt.status !== 'completed' && (
                          <button 
                            onClick={() => handleStatusUpdate(apt._id, 'completed')}
                            className="p-1.5 text-slate-500 hover:text-emerald-400 transition-colors"
                            title="Mark as completed"
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        {apt.status !== 'cancelled' && (
                          <button 
                            onClick={() => handleStatusUpdate(apt._id, 'cancelled')}
                            className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                            title="Cancel appointment"
                          >
                            <XCircle size={18} />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(apt._id)}
                          className="p-1.5 text-slate-500 hover:text-white transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

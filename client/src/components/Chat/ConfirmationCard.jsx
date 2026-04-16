import React from 'react';
import { motion } from 'framer-motion';
import { Check, Calendar, Clock, User, X } from 'lucide-react';

const ConfirmationCard = ({ details, type, onConfirm, onCancel }) => {
  if (!details) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="confirm-card"
    >
      <h3>
        <Check size={20} className="text-emerald-400" />
        {type === 'CONFIRM_CANCEL' ? 'Cancel Appointment?' : 'Confirm Appointment details'}
      </h3>

      <div className="space-y-1">
        <div className="detail-row">
          <span className="detail-label flex items-center gap-2"><User size={14} /> Name</span>
          <span className="detail-value">{details.name || 'N/A'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label flex items-center gap-2"><Calendar size={14} /> Date</span>
          <span className="detail-value">{details.date || 'N/A'}</span>
        </div>
        <div className="detail-row">
          <span className="detail-label flex items-center gap-2"><Clock size={14} /> Time</span>
          <span className="detail-value">{details.time || 'N/A'}</span>
        </div>
        <div className="pt-3 text-sm text-slate-400 italic">
          "{details.reason || 'General booking'}"
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={onConfirm}
          className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl shadow-lg transition-all"
        >
          {type === 'CONFIRM_CANCEL' ? 'Yes, Cancel' : 'Confirm Booking'}
        </button>
        <button
          onClick={onCancel}
          className="p-3 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl transition-all"
        >
          <X size={20} />
        </button>
      </div>
    </motion.div>
  );
};

export default ConfirmationCard;

const Appointment = require('../models/Appointment');

class AppointmentService {
  /**
   * Check if a slot is available
   */
  async checkConflict(date, time) {
    const existing = await Appointment.findOne({ date, time, status: { $ne: 'cancelled' } });
    return !!existing;
  }

  /**
   * Find available slots if there's a conflict
   */
  async suggestNextSlots(date, time) {
    const suggestions = [];
    let [hours, minutes] = time.split(':').map(Number);
    
    // Check next 4 slots (30 min intervals)
    for (let i = 1; i <= 4; i++) {
        minutes += 30;
        if (minutes >= 60) {
            hours += 1;
            minutes -= 60;
        }
        
        const nextTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
        const isConflict = await this.checkConflict(date, nextTime);
        
        if (!isConflict) {
            suggestions.push(nextTime);
        }
        
        if (suggestions.length >= 2) break; // Suggest 2 alternatives
    }
    
    return suggestions;
  }

  async createAppointment(data) {
    const isConflict = await this.checkConflict(data.date, data.time);
    if (isConflict) {
      const suggestions = await this.suggestNextSlots(data.date, data.time);
      throw { type: 'CONFLICT', suggestions };
    }
    
    return await Appointment.create(data);
  }

  async getAllAppointments(filters = {}) {
    return await Appointment.find(filters).sort({ date: 1, time: 1 });
  }

  async updateAppointmentStatus(id, status) {
    return await Appointment.findByIdAndUpdate(id, { status }, { new: true });
  }

  async findByDetails(email, date) {
    return await Appointment.findOne({ email, date, status: { $ne: 'cancelled' } });
  }

  async cancelAppointment(id) {
    return await this.updateAppointmentStatus(id, 'cancelled');
  }
}

module.exports = new AppointmentService();

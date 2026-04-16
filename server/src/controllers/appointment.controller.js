const appointmentService = require('../services/appointment.service');

exports.getAll = async (req, res, next) => {
  try {
    const filters = {};
    if (req.query.status) filters.status = req.query.status;
    if (req.query.date) filters.date = req.query.date;

    const appointments = await appointmentService.getAllAppointments(filters);
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const appointment = await appointmentService.updateAppointmentStatus(id, status);
    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { id } = req.params;
    await appointmentService.cancelAppointment(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointment.controller');

router.get('/', appointmentController.getAll);
router.patch('/:id/status', appointmentController.updateStatus);
router.delete('/:id', appointmentController.delete);

module.exports = router;

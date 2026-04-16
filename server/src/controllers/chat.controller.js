const aiService = require('../services/ai.service');
const appointmentService = require('../services/appointment.service');

exports.processChatMessage = async (req, res, next) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // 1. AI Extracts Intent and Data
    const extraction = await aiService.extractIntentAndData(message, history);
    const { intent, data, message: aiFollowUp } = extraction;

    // 2. Handle specific intents
    let responsePayload = {
      intent,
      extractedData: data,
      aiMessage: aiFollowUp,
      actionRequired: false
    };

    if (intent === 'book') {
      // Check if we have enough info to proceed with a "dry run" booking check
      if (data.date && data.time) {
        try {
          const isConflict = await appointmentService.checkConflict(data.date, data.time);
          if (isConflict) {
            const suggestions = await appointmentService.suggestNextSlots(data.date, data.time);
            responsePayload.aiMessage = `I'm sorry, but ${data.date} at ${data.time} is already booked. How about ${suggestions.join(' or ')}?`;
            responsePayload.suggestions = suggestions;
          } else {
            // Signal to frontend that it can show the "Confirm" button
            responsePayload.actionRequired = true;
            responsePayload.actionType = 'CONFIRM_BOOKING';
          }
        } catch (err) {
            console.error(err);
        }
      } else {
          // AI message already handles asking for missing fields
      }
    } else if (intent === 'cancel' || intent === 'reschedule') {
        // Find existing booking if email or name provided
        if (data.email) {
            const existing = await appointmentService.findByDetails(data.email, data.date);
            if (existing) {
                responsePayload.actionRequired = true;
                responsePayload.actionType = intent === 'cancel' ? 'CONFIRM_CANCEL' : 'CONFIRM_RESCHEDULE';
                responsePayload.appointmentId = existing._id;
            } else {
                responsePayload.aiMessage = `I couldn't find any appointment for ${data.email} on ${data.date || 'that date'}. Could you double-check the details?`;
            }
        }
    }

    res.json(responsePayload);
  } catch (error) {
    next(error);
  }
};

exports.confirmAction = async (req, res, next) => {
  try {
    const { actionType, data, appointmentId } = req.body;

    let result;
    let message;

    switch (actionType) {
      case 'CONFIRM_BOOKING':
        // Final creation in DB
        result = await appointmentService.createAppointment(data);
        message = `Great! Your appointment is confirmed for ${result.date} at ${result.time}.`;
        break;
      
      case 'CONFIRM_CANCEL':
        result = await appointmentService.cancelAppointment(appointmentId);
        message = `Your appointment has been successfully cancelled.`;
        break;

      default:
        return res.status(400).json({ error: 'Invalid action type' });
    }

    res.status(201).json({ success: true, message, result });
  } catch (error) {
    if (error.type === 'CONFLICT') {
        return res.status(409).json({ error: 'Slot taken', suggestions: error.suggestions });
    }
    next(error);
  }
};

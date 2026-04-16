/**
 * Logic Test: Verifies core business rules using Jest.
 */
const appointmentService = require('../src/services/appointment.service');
const Appointment = require('../src/models/Appointment');

// Mocking Mongoose Model
jest.mock('../src/models/Appointment');

describe('Appointment Service Logic', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should detect existing conflicts', async () => {
    Appointment.findOne.mockResolvedValue({ _id: 'existing-id' });
    const conflict = await appointmentService.checkConflict('2026-04-17', '14:00');
    expect(conflict).toBe(true);
    expect(Appointment.findOne).toHaveBeenCalledWith({ 
      date: '2026-04-17', 
      time: '14:00', 
      status: { $ne: 'cancelled' } 
    });
  });

  test('should suggest next available slots if conflict exists', async () => {
    // Scenario: 14:30 is taken, but 15:00 and 15:30 are free
    Appointment.findOne
      .mockResolvedValueOnce({ _id: 'taken-1430' }) // 14:30 check
      .mockResolvedValue(null); // 15:00 and onwards check
    
    const suggestions = await appointmentService.suggestNextSlots('2026-04-17', '14:00');
    
    expect(suggestions).toContain('15:00');
    expect(suggestions).toContain('15:30');
    expect(suggestions.length).toBe(2);
  });
});

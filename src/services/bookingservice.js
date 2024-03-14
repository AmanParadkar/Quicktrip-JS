// services/bookingService.js

import Booking from '../models/Booking';

const bookingService = {
  createBooking: async (bookingData) => {
    try {
      const booking = await Booking.create(bookingData);
      return booking;
    } catch (error) {
      throw new Error('Error creating booking: ' + error.message);
    }
  },

  getBookingById: async (bookingId) => {
    try {
      const booking = await Booking.findByPk(bookingId);
      return booking;
    } catch (error) {
      throw new Error('Error fetching booking: ' + error.message);
    }
  },

  // Add more functions as needed
};

export default bookingService;

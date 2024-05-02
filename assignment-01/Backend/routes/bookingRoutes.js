const express = require('express');
const router = express.Router();
const {createBooking, getBookings, updateBooking, deleteBooking} = require("../controllers/bookingControllers");
const {validateAdminToken} = require("../middleware/ValidateToken");

// Route to get all bookings, requires valid admin token
router.get('/bookings',validateAdminToken, getBookings);

// Route to create a new booking, requires valid admin token
router.post('/bookings',validateAdminToken, createBooking);

// Route to update a specific booking by ID, requires valid admin token
router.put('/:bookingId',validateAdminToken, updateBooking);

// Route to delete a specific booking by ID, requires valid admin token
router.delete('/:bookingId',validateAdminToken, deleteBooking);

module.exports = router;
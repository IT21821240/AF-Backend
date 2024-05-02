const Booking = require("../models/booking");
const Admin = require("../models/admin");
const Course = require("../models/course");
const Room = require("../models/room");
const logger= require("../utils/logger");

// Controller function to get all bookings
const getBookings = async (req, res) => {
    try {
      // Check if the user is an admin
      if (!req.user.adminID) {
        logger.warn("Unauthorized access attempted in getBookings");
        return res
          .status(401)
          .json({ message: "You are not authorized as admin" });
      }
      // Retrieve all bookings
        const bookings = await Booking.find();
        res.status(200).json({
            success: true,
            message: "All Booking Entries",
            data: bookings
        });
    } catch (error) {
        console.error("Error while fetching Bookings:", error);
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error while fetching Booking entries"
        });
    }
};


// Create a new booking
const createBooking = async (req, res) => {
    try {
      // Check if the user is an admin
      if (!req.user.adminID) {
        logger.warn("Unauthorized access attempted in createBooking");
        return res
          .status(401)
          .json({ message: "You are not authorized as admin" });
      }

      const { startTime, day, endTime, roomId, courseCode } = req.body;

      if (!roomId || !courseCode || !startTime || !endTime) {
        return res
          .status(400)
          .json({ success: false, message: "Missing required fields" });
      }
  
      // Check if roomId exists
    const roomExists = await Room.exists({ roomId: roomId });
    if (!roomExists) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid roomId provided" });
    }

      // Check if course with provided courseCode exists
      const courseExists = await Course.exists({ courseCode: courseCode });
      if (!courseExists) {
        return res.status(400).json({ success: false, message: "Invalid course code provided" });
      }
      
      //check whether the admin exist
       const adminExists = await Admin.exists({ adminID: req.user.adminID });
     if (!adminExists) {
      return res
        .status(400)
         .json({ success: false, message: "Invalid adminId provided" });
     }

      const existingBooking = await Booking.findOne({
        roomId,
        day,
        startTime,
        endTime,
      });
      if (existingBooking) {
        return res.status(409).json({
          success: false,
          message: "Booking already exists",
        });
      }
  
      // Create and save the new booking
      const booking = new Booking({
        roomId,
        courseCode,
        day,
        bookedBy: req.user.adminID,
        startTime,
        endTime,
      });
  
      const newBooking = await booking.save();
      return res.status(201).json({
        success: true,
        message: "New booking created successfully",
        data: newBooking
      });
    } catch (error) {
      logger.error("Error while create booking", { error });
      console.error("Error while creating booking:", error);
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  

// Update a booking
const updateBooking = async (req, res) => {
    try {
      if (!req.user.adminID) {
        logger.warn("Unauthorized access attempted in updateBooking");
        return res
          .status(401)
          .json({ message: "You are not authorized as admin" });
      }

        const { bookingId } = req.params;
        const { startTime, endTime,day, roomId, courseCode } = req.body;

        // Check if roomId exists
    const roomExists = await Room.exists({ roomId: roomId });
    if (!roomExists) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid roomId provided" });
    }

    // Check if courseId exists
    const courseExists = await Course.exists({ courseCode: courseCode });
    if (!courseExists) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid courseId provided" });
    }

    //check whether admin exists
    const adminExists = await Admin.exists({ adminID: req.user.adminID });
    if (!adminExists) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid adminId provided" });
    }

    // Check if the booking already exists
    const existingBooking = await Booking.findOne({
        roomId,
        day,
        startTime,
        endTime,
      });
      if (existingBooking) {
        return res.status(409).json({
          success: false,
          message: "Booking already exists",
        });
      }

        const booking = await Booking.findByIdAndUpdate(
            bookingId,
            {
                startTime,
                endTime,
                day,
                bookedBy: req.user.adminId,
                roomId,
                courseCode
            },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking entry not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Booking entry updated successfully",
            data: booking
        });
    } catch (error) {
      logger.error("Error while updating booking", { error });
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error while updating Booking entry"
        });
    }
};


// Delete a booking
const deleteBooking = async (req, res) => {
    try {
      // Check if the user is an admin
      if (!req.user.adminID) {
        logger.warn("Unauthorized access attempted in deleteBooking");
        return res
          .status(401)
          .json({ message: "You are not authorized as admin" });
      }
        const {bookingId} = req.params;
        const booking = await Booking.findByIdAndDelete(bookingId);
        if (!booking) {
            return res.status(404).json({ 
                success: false,
                message: 'Booking not found' 
            });
        }
        
        return res.status(200).json({
            success: true,
            message: "Booking deleted successfully"
        });
    } catch (error) {
      logger.error("Error while deleting booking", { error });
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error while deleting booking entry"
        });
    }
};

module.exports = {
    getBookings,
    createBooking,
    updateBooking,
    deleteBooking
};

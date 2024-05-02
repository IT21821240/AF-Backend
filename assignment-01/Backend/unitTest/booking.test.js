const { getBookings, deleteBooking, updateBooking , createBooking} = require('../controllers/bookingControllers');
const Booking = require('../models/booking'); 
const logger = require('../utils/logger'); 
const Room = require("../models/room");
const Course = require("../models/course");
const Admin =require("../models/admin");

jest.mock('../utils/logger', () => ({
    warn: jest.fn(),
    error: jest.fn(),
  }));

describe('getBookings', () => {
  let req, res;

  beforeEach(() => {
    req = { 
      user: { adminID: 'someAdminID' }
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn()
    };
  });

  it('should return all booking entries if user is admin', async () => {
    const mockBookings = [{}, {}]; // Mock booking data
    Booking.find = jest.fn().mockResolvedValue(mockBookings);

    await getBookings(req, res);

    expect(Booking.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "All Booking Entries",
      data: mockBookings
    });
  });

  it('should return 401 status and message if user is not admin', async () => {
    req.user.adminID = null;

    await getBookings(req, res);

    expect(logger.warn).toHaveBeenCalledWith("Unauthorized access attempted in getBookings");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "You are not authorized as admin" });
  });
});


describe('deleteBooking', () => {
    let req, res;
  
    beforeEach(() => {
      req = { 
        user: { adminID: 'someAdminID' },
        params: { bookingId: 'someBookingId' }
      };
      res = {
        status: jest.fn(() => res),
        json: jest.fn()
      };

      logger.warn = jest.fn();
    });
  
    it('should delete booking successfully if user is admin', async () => {
      const mockDeletedBooking = { _id: 'someBookingId', /* Other properties */ };
      Booking.findByIdAndDelete = jest.fn().mockResolvedValue(mockDeletedBooking);
  
      await deleteBooking(req, res);
  
      expect(Booking.findByIdAndDelete).toHaveBeenCalledWith('someBookingId');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Booking deleted successfully"
      });
    });
  
    it('should return 401 status and message if user is not admin', async () => {
      req.user.adminID = null;
  
      await deleteBooking(req, res);
  
      expect(logger.warn).toHaveBeenCalledWith("Unauthorized access attempted in deleteBooking");
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "You are not authorized as admin" });
    });
  
    it('should return 404 status if booking not found', async () => {
      Booking.findByIdAndDelete = jest.fn().mockResolvedValue(null);
  
      await deleteBooking(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ 
        success: false,
        message: 'Booking not found' 
      });
    });
  
    it('should handle errors and return 500 status', async () => {
      const errorMessage = 'Some error occurred';
      const error = new Error(errorMessage);
      Booking.findByIdAndDelete = jest.fn().mockRejectedValue(error);
  
      await deleteBooking(req, res);
  
      expect(logger.error).toHaveBeenCalledWith("Error while deleting booking", { error });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: errorMessage,
        message: "Error while deleting booking entry"
      });
    });
  });

  describe('updateBooking', () => {
    let req;
    let res;
    beforeEach(() => {
      req = {
        user: { adminID: 'someAdminID' }, // Mock admin ID
        params: { bookingId: 'someBookingId' }, // Mock booking ID
        body: {
          startTime: 'someStartTime',
          endTime: 'someEndTime',
          day: 'someDay',
          roomId: 'someRoomId',
          courseCode: 'someCourseCode'
        }
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
  
    it('should return 400 status if invalid roomId provided', async () => {
      Room.exists = jest.fn().mockResolvedValue(false);
  
      await updateBooking(req, res);
    });
  
    it('should return 400 status if invalid courseId provided', async () => {
      Room.exists = jest.fn().mockResolvedValue(true);
      Course.exists = jest.fn().mockResolvedValue(false);
  
      await updateBooking(req, res);
    });
  
    it('should return 400 status if invalid adminId provided', async () => {
      Room.exists = jest.fn().mockResolvedValue(true);
      Course.exists = jest.fn().mockResolvedValue(true);
      Admin.exists = jest.fn().mockResolvedValue(false);
  
      await updateBooking(req, res);
    });
  
    it('should return 409 status if booking already exists', async () => {
      Room.exists = jest.fn().mockResolvedValue(true);
      Course.exists = jest.fn().mockResolvedValue(true);
      Admin.exists = jest.fn().mockResolvedValue(true);
      Booking.findOne = jest.fn().mockResolvedValue({ /* Mock existing booking */ });
  
      await updateBooking(req, res);
  
    });
  });

  describe('createBooking', () => {
    it('should create a new booking successfully if user is admin and all data is valid', async () => {
        const req = {
            body: {
                startTime: '9:00',
                day: '2024-04-01',
                endTime: '11:00',
                roomId: 'roomId123',
                courseCode: 'COMP101'
            },
            user: { adminID: 'admin123' }
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        const mockBooking = {
            _id: 'booking123',
            roomId: 'roomId123',
            courseCode: 'COMP101',
            day: '2024-04-01',
            bookedBy: 'admin123',
            startTime: '9:00',
            endTime: '11:00'
        };
        jest.spyOn(Room, 'exists').mockResolvedValue(true);
        jest.spyOn(Course, 'exists').mockResolvedValue(true);
        jest.spyOn(Admin, 'exists').mockResolvedValue(true);
        jest.spyOn(Booking.prototype, 'save').mockResolvedValue(mockBooking);

        await createBooking(req, res);
        
    });
});
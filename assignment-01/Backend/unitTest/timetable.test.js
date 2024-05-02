const { getAllTimetables, deleteTimetable, createTimetable, updateTimetable } = require('../controllers/timetableController');
const Timetable = require('../models/timetable'); 
const logger = require('../utils/logger'); 
const Course = require("../models/course");
const Faculty = require("../models/faculty");
const Booking = require("../models/booking");

jest.mock('../utils/logger', () => ({
    warn: jest.fn(),
    error: jest.fn(),
  }));

describe('getAllTimetables', () => {
  let req, res, next;

  beforeEach(() => {
    req = { user: { adminID: 'someAdminID' } };
    res = {
      status: jest.fn(() => res),
      json: jest.fn()
    };
    next = jest.fn();
  });

  it('should return all timetable entries if user is admin', async () => {
    req.user.adminID = 'someAdminID';

    const mockTimetables = [{}, {}]; // Mock timetable data
    Timetable.find = jest.fn().mockResolvedValue(mockTimetables);

    await getAllTimetables(req, res);

    expect(Timetable.find).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "All timetable entries",
      data: mockTimetables
    });
  });

  it('should return 401 status and message if user is not admin', async () => {
    req.user.adminID = null;

    await getAllTimetables(req, res);

    expect(logger.warn).toHaveBeenCalledWith("Unauthorized access attempted in getAllTimetables");
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "You are not authorized as admin" });
  });

  it('should handle errors and return 500 status', async () => {
    req.user.adminID = 'someAdminID';
    const errorMessage = 'Some error occurred';
    const error = new Error(errorMessage);
    Timetable.find = jest.fn().mockRejectedValue(error);

    await getAllTimetables(req, res);

    expect(logger.error).toHaveBeenCalledWith("Error while updating timetable.", { error });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: errorMessage,
      message: "Error while fetching timetable entries"
    });
  });
});

describe('deleteTimetable', () => {
    let req, res, next;
  
    beforeEach(() => {
      req = { 
        user: { adminID: 'someAdminID' },
        params: { timetableId: 'someTimetableId' }
      };
      res = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
      next = jest.fn();
    });
  
    it('should delete timetable entry if user is admin and entry exists', async () => {
      const mockDeletedEntry = { _id: 'someTimetableId', /* Other properties */ };
      Timetable.findByIdAndDelete = jest.fn().mockResolvedValue(mockDeletedEntry);
  
      await deleteTimetable(req, res);
  
      expect(Timetable.findByIdAndDelete).toHaveBeenCalledWith('someTimetableId');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Timetable entry deleted successfully"
      });
    });
  
    it('should return 401 status and message if user is not admin', async () => {
      req.user.adminID = null;
  
      await deleteTimetable(req, res);
  
      expect(logger.warn).toHaveBeenCalledWith("Unauthorized access attempted in deleteTimetable");
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "You are not authorized as admin" });
    });
  
    it('should return 404 status if timetable entry does not exist', async () => {
      Timetable.findByIdAndDelete = jest.fn().mockResolvedValue(null);
  
      await deleteTimetable(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Timetable entry not found"
      });
    });
  
    it('should handle errors and return 500 status', async () => {
      const errorMessage = 'Some error occurred';
      const error = new Error(errorMessage);
      Timetable.findByIdAndDelete = jest.fn().mockRejectedValue(error);
  
      await deleteTimetable(req, res);
  
      expect(logger.error).toHaveBeenCalledWith("Error while deleting timetable.", { error });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: errorMessage,
        message: "Error while deleting timetable entry"
      });
    });
  });

  describe('createTimetable', () => {
    let req, res;
  
    beforeEach(() => {
      req = { 
        user: { adminID: 'someAdminID' },
        body: {
          courseId: 'someCourseId',
          day: 'Monday',
          startTime: '09:00',
          endTime: '10:00',
          facultyId: 'someFacultyId',
          location: 'someLocation'
        }
      };
      res = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
    });
  
    it('should create timetable entry if user is admin and all required fields are provided', async () => {
      const mockSavedEntry = {
        _id: 'someId',
        courseId: 'someCourseId',
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
        facultyId: 'someFacultyId',
        location: 'someLocation'
      };
  
      Course.findOne = jest.fn().mockResolvedValue(true);
      Faculty.findOne = jest.fn().mockResolvedValue(true);
      Timetable.findOne = jest.fn().mockResolvedValue(null);
      Booking.findOne = jest.fn().mockResolvedValue(true);
  
      Timetable.prototype.save = jest.fn().mockResolvedValue(mockSavedEntry);
  
      await createTimetable(req, res);
  
      expect(Timetable.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Timetable entry created successfully",
        data: mockSavedEntry
      });
    });

  });

  describe('updateTimetable', () => {
    let req, res;
  
    beforeEach(() => {
      req = { 
        user: { adminID: 'someAdminID' },
        params: { timetableId: 'someTimetableId' },
        body: {
          courseId: 'someCourseId',
          day: 'Monday',
          startTime: '09:00',
          endTime: '10:00',
          facultyId: 'someFacultyId',
          location: 'someLocation'
        }
      };
      res = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
    });
  
    it('should update timetable entry if user is admin and all required fields are provided', async () => {
      const mockUpdatedEntry = {
        _id: 'someTimetableId',
        courseId: 'someCourseId',
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
        facultyId: 'someFacultyId',
        location: 'someLocation'
      };
  
      Timetable.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedEntry);
      Booking.findOne = jest.fn().mockResolvedValue(true);
      Course.findOne = jest.fn().mockResolvedValue(true);
      Faculty.findOne = jest.fn().mockResolvedValue(true);
  
      await updateTimetable(req, res);
  
      expect(Timetable.findByIdAndUpdate).toHaveBeenCalledWith('someTimetableId', {
        courseId: 'someCourseId',
        day: 'Monday',
        startTime: '09:00',
        endTime: '10:00',
        facultyId: 'someFacultyId',
        location: 'someLocation'
      }, { new: true });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Timetable entry updated successfully",
        data: mockUpdatedEntry
      });
    }, 15000);
  });
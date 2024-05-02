const Timetable = require('../models/timetable');
const Course = require('../models/course');
const Faculty = require('../models/faculty');
const Booking =require("../models/booking");
const StudentEnrollment = require("../models/studentEnrollment");
const {createNotification} = require("../controllers/notificationController");
const logger= require("../utils/logger");

// Controller function to create a new timetable entry
const createTimetable = async (req, res) => {
    try {
      // Check if the request is made by an admin
        if (!req.user.adminID) {
          logger.warn("Unauthorized access attempted in createTimetable");
            return res
              .status(401)
              .json({ message: "You are not authorized as admin" });
          }

        const { courseId, day, startTime, endTime, facultyId, location } = req.body;

        if (!startTime || !day || !endTime || !facultyId || !courseId || !location) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // Check if the course exists
        const existingCourse = await Course.findOne({ courseCode: courseId });
    if (!existingCourse) {
      return res.status(409).json({
        success: false,
        message: "Course should be there to create the timetable",
      });
    }

    // Check if the faculty exists
    const existingFaculty = await Faculty.findOne({ facultyID: facultyId });
    if (!existingFaculty) {
      return res.status(409).json({
        success: false,
        message: "Faculty should be there to create the timetable",
      });
    }

    // Check if the timetable entry already exists
    const existingTimeTable = await Timetable.findOne({
      courseId,
      day,
      startTime,
      endTime,
      facultyId,
      location,
    });
    if (existingTimeTable) {
      return res
        .status(400)
        .json({ success: false, message: "TImetable already exists" });
    }

// Check if the booking exists
    const existingBooking = await Booking.findOne({
      courseCode: courseId,
      roomId: location,
      day: day,
      startTime: startTime,
      endTime: endTime,
    });


    if (!existingBooking) {
      return res.status(409).json({
        success: false,
        message: "Booking should be there to create the timetable",
      });
    }

        const timetable = new Timetable({
            courseId,
            day,
            startTime,
            endTime,
            facultyId,
            location
        });

        const savedEntry = await timetable.save();

        if (savedEntry) {
            return res.status(201).json({
                success: true,
                message: "Timetable entry created successfully",
                data: savedEntry
            });
        } else {
            return res.status(400).json({ success: false, error: "Timetable data not valid" });
        }
    } catch (error) {
      logger.error("Error while creating timetable.", { error });
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};

// Controller function to update a timetable entry by ID
const updateTimetable = async (req, res) => {
    try {
      // Check if the request is made by an admin
        if (!req.user.adminID) {
          logger.warn("Unauthorized access attempted in updateTimetable");
            return res
              .status(401)
              .json({ message: "You are not authorized as admin" });
          }

        const { timetableId } = req.params;
        const { courseId, day, startTime, endTime, facultyId, location } = req.body;
        
        // Check if the booking exists
        const existingBooking = await Booking.findOne({
          courseCode: courseId,
          roomId: location,
          day: day,
          startTime: startTime,
          endTime: endTime,
          });
          if (!existingBooking) {
            return res.status(409).json({
              success: false,
              message: "Booking should be there to create the timetable",
            });
          }
      
          const existingCourse = await Course.findOne({ courseCode: courseId });
          if (!existingCourse) {
            return res.status(409).json({
              success: false,
              message: "Course should be there to create the timetable",
            });
          }
      
          const existingFaculty = await Faculty.findOne({ facultyID: facultyId });
          if (!existingFaculty) {
            return res.status(409).json({
              success: false,
              message: "Faculty should be there to create the timetable",
            });
          }

        const updatedEntry = await Timetable.findByIdAndUpdate(
            timetableId,
            {
                courseId,
                day,
                startTime,
                endTime,
                facultyId,
                location
            },
            { new: true }
        );

        if (!updatedEntry) {
            return res.status(404).json({
                success: false,
                message: "Timetable entry not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Timetable entry updated successfully",
            data: updatedEntry
        });

        // Notify students and faculty about the timetable update
        const studentEnrollments = await StudentEnrollment.find({ courseId });
        const studentIds = studentEnrollments.map((enrollment) => enrollment.studentId);
        const message = `Timetable updated for your course ${updatedEntry.courseId}`;
        const notificationPromises = studentIds.map(async (studentId) => {
          await createNotification(studentId, message);
        });
        notificationPromises.push(createNotification(facultyId, message));
        await Promise.all(notificationPromises);

        } catch (error) {
        logger.error("Error while creating timetable.", { error });
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error while updating timetable entry"
        });
    }
};

// Controller function to get all timetable entries
const getAllTimetables = async (req, res) => {
    try {
      // Check if the request is made by an admin
        if (!req.user.adminID) {
          logger.warn("Unauthorized access attempted in getAllTimetables");
            return res
              .status(401)
              .json({ message: "You are not authorized as admin" });
          }

        const timetables = await Timetable.find();
        
        res.status(200).json({
            success: true,
            message: "All timetable entries",
            data: timetables
        });
    } catch (error) {
      logger.error("Error while updating timetable.", { error });
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error while fetching timetable entries"
        });
    }
};

// Controller function to delete timetable entries
const deleteTimetable = async (req, res) => {
    try {
        if (!req.user.adminID) {
          logger.warn("Unauthorized access attempted in deleteTimetable");
            return res
              .status(401)
              .json({ message: "You are not authorized as admin" });
        }
        const { timetableId } = req.params;

        const deletedEntry = await Timetable.findByIdAndDelete(timetableId);

        if (!deletedEntry) {
            return res.status(404).json({
                success: false,
                message: "Timetable entry not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Timetable entry deleted successfully"
        });
    } catch (error) {
      logger.error("Error while deleting timetable.", { error });
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error while deleting timetable entry"
        });
    }
};

// Controller function to student enrolled timetable entries
const getStudentTimetable = async (req, res) => {
  try {
    const studentId = req.user.studentID;
    if (!studentId) {
      logger.warn(
        `Unauthorized access: ${studentId} is not authorized as student`
      );
      return res
        .status(401)
        .json({ message: "You are not authorized as student" });
    }
    const enrollments = await StudentEnrollment.find({ studentId:studentId });

    const courseIds = enrollments.map((enrollment) => enrollment.courseId);

    const timetables = await Timetable.find({ courseId: { $in: courseIds } });

    res.json(timetables);
  } catch (error) {
    logger.error("Error fetching timetables:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Controller function to faculty assigned timetable entries
const getFacultyTimetable = async (req, res) => {
  try {
    const facultyId = req.user.facultyID;
    if (!facultyId) {
      logger.warn("Unauthorized access attempted in getFacultyTimetable");
      return res
        .status(401)
        .json({ message: "You are not authorized as faculty" });
    }
    const courses = await Course.find({ faculties:facultyId });

    const courseIds = courses.map((course) => course.courseCode);

    const timetables = await Timetable.find({ courseId: { $in: courseIds } });

    res.json(timetables);
  } catch (error) {
    logger.error("Error while faculty getting timetable.", { error });
    res.status(500).json({ error: "Internal Server Error" });
  }
};


module.exports = { createTimetable, getAllTimetables, updateTimetable, deleteTimetable,getStudentTimetable, getFacultyTimetable };

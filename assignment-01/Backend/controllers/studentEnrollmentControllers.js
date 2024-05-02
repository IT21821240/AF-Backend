const StudentEnrollment = require('../models/studentEnrollment');
const Student = require("../models/student");
const Course = require("../models/course");
const logger= require("../utils/logger");

// Enroll a student in a course
const enrollStudentInCourse = async (req, res) => {
    try {
      // Check if the request is made by a student
        if (!req.user.studentID) {
            logger.warn("Unauthorized access attempted in enrollStudentInCourse");
            return res
              .status(401)
              .json({ message: "You are not authorized as student" });
          }
        const { courseId } = req.body;

        // Check if the student exists
        const studentExists = await Student.exists({
            studentID: req.user.studentID,
          });
          if (!studentExists) {
            return res
              .status(400)
              .json({ success: false, message: "Invalid student Id provided" });
          }
      
          // Check if the course exists
          const courseExists = await Course.exists({ courseCode: courseId });
          if (!courseExists) {
            return res
              .status(400)
              .json({ success: false, message: "Invalid course Id provided" });
          }
      
          // Check if the enrollment already exists
          const existingEnrollment = await StudentEnrollment.findOne({
            studentId: req.user.studentID,
            courseId,
          });
          if (existingEnrollment) {
            return res
              .status(400)
              .json({ success: false, message: "Enrollment already exists" });
          }
      
          // Create a new enrollment
          const enrollment = await StudentEnrollment.create({
            studentId: req.user.studentID,
            courseId,
          });
      
          res.status(201).json({
            status: "success",
            message: "Enrollment done successfully",
            data: enrollment,
          });
        } catch (error) {
          logger.error("Error enrolling student:", error);
          return res
            .status(500)
            .json({ success: false, message: "Internal server error" });
      }
    };


// Get all enrollments for a student
const getStudentEnrollments = async (req, res) => {
    try {
      // Check if the request is made by a student
        if (!req.user.studentID) {
            logger.warn("Unauthorized access attempted in getStudentEnrollments");
            return res
              .status(401)
              .json({ message: "You are not authorized as student" });
          }
          
        const studentId = req.params.studentId;
        const enrollments = await StudentEnrollment.find({ studentId });
        return res.status(200).json({
            success: true,
            message: "All Enrollment entries for the student",
            data: enrollments
        });
    } catch (error) {
        logger.error("Error while fetching students enrollments entries", { error });
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error while fetching students enrollments entries"
        });
    }
};


// Get all enrollments for a course
const getEnrollmentsByCourse = async (req, res) => {
    try {
      // Check if the request is made by an admin
        if (!req.user.adminID) {
            logger.warn("Unauthorized access attempted in getEnrollmentsByCourse");
            return res
              .status(401)
              .json({ message: "You are not authorized as admin" });
          }
        const courseId = req.params.courseId;
        const enrollments = await StudentEnrollment.find({ courseId });
        return res.status(200).json({
            success: true,
            message: "All Enrollment entries for the course",
            data: enrollments
        });
    } catch (error) {
        logger.error("Error while fetching students enrollments entries", { error });
        return res.status(500).json({
            success: false,
            error: error.message,
            message: "Error while fetching students enrollments entries"
        });
    }
};

module.exports = {
    enrollStudentInCourse,
    getStudentEnrollments,
    getEnrollmentsByCourse
};

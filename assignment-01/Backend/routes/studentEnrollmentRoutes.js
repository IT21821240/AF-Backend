const express = require('express');
const router = express.Router();
const {enrollStudentInCourse, getStudentEnrollments,getEnrollmentsByCourse} = require("../controllers/studentEnrollmentControllers");
const {validateAdminToken, validateStudentToken} = require("../middleware/ValidateToken");

// Route to enroll a student in a course, requires valid student token
router.post('/enrollments',validateStudentToken, enrollStudentInCourse);

// Route to get enrollments for a specific student, requires valid student token
router.get('/enrollments/:studentId',validateStudentToken, getStudentEnrollments);

// Route to get enrollments for a specific course, requires valid admin token
router.get('/enrollments/course/:courseId',validateAdminToken, getEnrollmentsByCourse);

module.exports = router;

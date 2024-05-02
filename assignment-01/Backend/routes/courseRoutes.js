const express = require("express");
const router = express.Router();
const {createCourse, getAllCourses, updateCourse, deleteCourse, getCourseById, getAllCoursesByFacultyId} = require("../controllers/courseController");
const {validateAdminToken,validateFacultyToken} = require("../middleware/ValidateToken");

// Route to get all courses,
router.get("/courses", getAllCourses);

// Route to create a new course, requires valid admin token
router.post('/courses',validateAdminToken, createCourse);

// Route to get a specific course by ID, requires valid faculty token
router.get("/:courseCode",validateFacultyToken, getCourseById);

// Route to update a specific course by ID, requires valid admin token
router.put("/:courseCode",validateAdminToken, updateCourse);

// Route to delete a specific course by ID, requires valid admin token
router.delete("/:courseCode",validateAdminToken, deleteCourse);

//Route to get all courses for a faculty, requires valid faculty token
router.get("/course/fac",validateFacultyToken,getAllCoursesByFacultyId);

module.exports = router;
const express = require('express');
const router = express.Router();
const {createTimetable, getAllTimetables, updateTimetable, 
    deleteTimetable, getFacultyTimetable, getStudentTimetable} = require("../controllers/timetableController");
const {validateAdminToken, validateFacultyToken, validateStudentToken} = require("../middleware/ValidateToken");

// Route to get all timetables, requires valid admin token
router.get("/timetables",validateAdminToken, getAllTimetables);

// Route to create a new timetable, requires valid admin token
router.post("/timetable",validateAdminToken, createTimetable);

// Route to update a specific timetable by ID, requires valid admin token
router.put("/:timetableId",validateAdminToken, updateTimetable);

// Route to delete a specific timetable by ID, requires valid admin token
router.delete("/:timetableId",validateAdminToken, deleteTimetable);

// Route to get faculty timetable for a specific course, requires valid faculty token
router.get("/fTb/:courseId",validateFacultyToken, getFacultyTimetable);

// Route to get student timetable for a specific course, requires valid student token
router.get("/sTb/:courseId",validateStudentToken, getStudentTimetable);

module.exports = router;
const express = require("express");
const router = express.Router();
const {createStudent, getAllStudents, getStudent, updateStudent, deleteStudent, studentLogin} = require("../controllers/studentController"); 
const {validateAdminToken, validateStudentToken} = require("../middleware/ValidateToken");

// Route to get all students, requires valid admin token
router.get("/students",validateAdminToken, getAllStudents);

// Route to create a new student
router.post("/students", createStudent);

// Route to get a specific student by ID, requires valid student token
router.get("/:studentID",validateStudentToken, getStudent);

// Route to update a specific student by ID, requires valid student token
router.put("/:studentID",validateStudentToken, updateStudent);

// Route to delete a specific student by ID, requires valid admin token
router.delete("/:studentID",validateAdminToken, deleteStudent);

// Route to log in as an student
router.post("/stuLogin", studentLogin);

module.exports = router;
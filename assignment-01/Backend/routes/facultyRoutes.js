const express = require("express");
const router = express.Router();
const{createFaculty, getAllFaculties, getFaculty, updateFaculty, deleteFaculty, facultyLogin} = require("../controllers/facultyController");
const {validateAdminToken, validateFacultyToken} = require("../middleware/ValidateToken");

// Route to get all faculties, requires valid admin token
router.get("/faculties",validateAdminToken, getAllFaculties);

// Route to create a new faculty
router.post("/faculties", createFaculty);

// Route to get a specific faculty by ID, requires valid faculty token
router.get("/:facultyID",validateFacultyToken, getFaculty);

// Route to update a specific faculty by ID, requires valid faculty token
router.put("/:facultyID",validateFacultyToken, updateFaculty);

// Route to delete a specific faculty by ID, requires valid faculty token
router.delete("/:facultyID",validateFacultyToken, deleteFaculty);

// Route to log in as an faculty
router.post("/facLogin", facultyLogin);

module.exports = router;
const express = require("express");
const router = express.Router();
const {createAdmin, getAllAdmins, getAdmin, updateAdmin, deleteAdmin, login} = require("../controllers/adminController");
const {validateAdminToken} = require("../middleware/ValidateToken");

// Route to get all admins, requires valid admin token
router.get("/admins",validateAdminToken, getAllAdmins);

// Route to create a new admin
router.post("/admins", createAdmin);

// Route to get a specific admin by ID, requires valid admin token
router.get("/:adminID",validateAdminToken, getAdmin);

// Route to update a specific admin by ID, requires valid admin token
router.put("/:adminID",validateAdminToken, updateAdmin);

// Route to delete a specific admin by ID, requires valid admin token
router.delete("/:adminID",validateAdminToken, deleteAdmin);

// Route to log in as an admin
router.post("/adminLogin", login);

module.exports = router;
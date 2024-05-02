const express = require("express");
const router = express.Router();
const {createRoom, getAllRooms,getRoom, updateRoom, deleteRoom} = require("../controllers/roomController");
const {validateAdminToken}= require("../middleware/ValidateToken");

// Route to get all rooms, requires valid admin token
router.get("/rooms",validateAdminToken, getAllRooms);

// Route to create a new room, requires valid admin token
router.post("/rooms",validateAdminToken, createRoom);

// Route to update a specific room by ID, requires valid admin token
router.put("/:roomId",validateAdminToken, updateRoom);

// Route to get a specific room by ID, requires valid admin token
router.get("/:roomId",validateAdminToken, getRoom);

// Route to delete a specific room by ID, requires valid admin token
router.delete("/:roomId",validateAdminToken, deleteRoom);

module.exports = router;
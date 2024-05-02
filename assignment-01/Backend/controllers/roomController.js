const Room = require("../models/room");
const logger= require("../utils/logger");

// Controller function to create a new room
const createRoom = async (req, res) => {
  try {
    // Check if the request is made by an admin
    if (!req.user.adminID) {
      logger.warn("Unauthorized access attempted in createRoom");
      return res
        .status(401)
        .json({ message: "You are not authorized as admin" });
    }

    const { floorNo, building, name, capacity, resources } = req.body;
    const { roomId } = req.params;

    if (!floorNo || !building || !name || !capacity) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const existingRoom = await Room.findOne({ roomId });
    if (existingRoom) {
      return res.status(409).json({
        success: false,
        message: "Room already exists",
      });
    }

    const newRoom = new Room({
      floorNo,
      building,
      name,
      capacity,
      resources,
    });

    await newRoom.save();

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      room: newRoom,
    });
  } catch (error) {
    logger.error("Error while creating rooms", { error });
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Controller function to get all rooms
const getAllRooms = async (req, res) => {
  try {
    // Check if the request is made by an admin
    if (!req.user.adminID) {
      logger.warn("Unauthorized access attempted in getAllRooms");
      return res
        .status(401)
        .json({ message: "You are not authorized as admin" });
    }

    const rooms = await Room.find();

    return res.status(200).json({
      success: true,
      message: "All Rooms List",
      rooms,
    });
  } catch (error) {
    logger.error("Error while getting all Rooms", { error });
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Controller function to update a room by ID
const updateRoom = async (req, res) => {
  try {
    // Check if the request is made by an admin
    if (!req.user.adminID) {
      logger.warn("Unauthorized access attempted in updateRoom");
      return res
        .status(401)
        .json({ message: "You are not authorized as admin" });
    }

    const roomId = req.params.roomId;
    const { floorNo, building, name, capacity, resources } = req.body;

    const room = await Room.findOne({roomId: roomId});
        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }
  
      const updatedRoom = await Room.findOneAndUpdate(
        {roomId: roomId},
        {floorNo, building, name, capacity, resources },
        { new: true }
      );
  
      if (!updatedRoom) {
        return res.status(404).json({ success: false, error: "Room not found" });
      }
  
      return res.status(200).json({
        success: true,
        message: "Room updated successfully",
        course: updatedRoom,
      });
    } catch (error) {
      logger.error("Error while updating Rooms", { error });
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
// Controller function to delete a room by ID
const deleteRoom = async (req, res) => {
  try {
    // Check if the request is made by an admin
    if (!req.user.adminID) {
      logger.warn("Unauthorized access attempted in deleteRoom");
      return res
        .status(401)
        .json({ message: "You are not authorized as admin" });
    }
    const roomId = req.params.roomId;

    const deletedRoom = await Room.findOneAndDelete({ roomId: roomId }); 

    if (!deletedRoom) {
      return res.status(404).json({ success: false, message: "Room not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Room deleted successfully",
      room: deletedRoom,
    });
  } catch (error) {
    logger.error("Error while deleting rooms", { error });
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Controller function to get a room by ID
const getRoom = async (req, res) => {
  try {
    // Check if the request is made by an admin
    if (!req.user.adminID) {
      logger.warn("Unauthorized access attempted in getRooms");
      return res
        .status(401)
        .json({ message: "You are not authorized as admin" });
    }
      const room = await Room.findOne({ roomId: req.params.roomId });
      if (!room) {
          return res.status(404).json({
              success: false,
              message: "Room not found",
          });
      }
      res.status(200).json({
          success: true,
          message: "Retrieved Room successfully",
          room,
      });
  } catch (error) {
      logger.error("Error while getting Rooms by ID", { error });
      res.status(500).json({
          success: false,
          error,
          message: "Error while getting Room",
      });
  }
};
module.exports = { createRoom, getAllRooms, updateRoom, deleteRoom , getRoom};

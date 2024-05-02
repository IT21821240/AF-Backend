const { getAllRooms, deleteRoom,updateRoom, createRoom } = require("../controllers/roomController");
const Room = require("../models/room");
const logger = require("../utils/logger");

jest.mock('../utils/logger', () => ({
    warn: jest.fn(),
    error: jest.fn(),
  }));

jest.mock("../models/Room", () => ({
  find: jest.fn(),
}));

describe("getAllRooms", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: {
        adminID: "AD501",
      },
    };

    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if user is not authorized as admin", async () => {
    req.user.adminID = undefined;
    await getAllRooms(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "You are not authorized as admin",
    });
  });

  it("should return all rooms when user is authorized as admin", async () => {
    const rooms = [
      { roomNumber: 101, capacity: 2 },
      { roomNumber: 102, capacity: 3 },
    ];
    Room.find.mockResolvedValueOnce(rooms);

    await getAllRooms(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "All Rooms List",
      rooms,
    });
  });

  it("should handle internal server error", async () => {
    Room.find.mockRejectedValueOnce(new Error("Database error"));

    await getAllRooms(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal server error",
    });
  });
});

describe('deleteRoom', () => {
    let req, res;
  
    beforeEach(() => {
      req = { 
        user: { adminID: 'someAdminID' },
        params: { roomId: 'someRoomId' }
      };
      res = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
    });
  
    it('should delete room if user is admin and room exists', async () => {
      const mockDeletedRoom = { roomId: 'someRoomId', /* Other properties */ };
      Room.findOneAndDelete = jest.fn().mockResolvedValue(mockDeletedRoom);
  
      await deleteRoom(req, res);
  
      expect(Room.findOneAndDelete).toHaveBeenCalledWith({ roomId: 'someRoomId' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Room deleted successfully",
        room: mockDeletedRoom
      });
    });
  
    it('should return 401 status and message if user is not admin', async () => {
      req.user.adminID = null;
  
      await deleteRoom(req, res);
  
      expect(logger.warn).toHaveBeenCalledWith("Unauthorized access attempted in deleteRoom");
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "You are not authorized as admin" });
    });
  
    it('should return 404 status if room does not exist', async () => {
      Room.findOneAndDelete = jest.fn().mockResolvedValue(null);
  
      await deleteRoom(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Room not found"
      });
    });
  });

  describe('updateRoom', () => {
    let req, res;
  
    beforeEach(() => {
      req = { 
        user: { adminID: 'someAdminID' },
        params: { roomId: 'someRoomId' },
        body: {
          floorNo: 1,
          building: 'Building A',
          name: 'Room 101',
          capacity: 20,
          resources: ['Projector', 'Whiteboard']
        }
      };
      res = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
    });
  
    it('should update room if user is admin and room exists', async () => {
      const mockUpdatedRoom = { roomId: 'someRoomId', /* Other properties */ };
      Room.findOne = jest.fn().mockResolvedValue(true);
      Room.findOneAndUpdate = jest.fn().mockResolvedValue(mockUpdatedRoom);
  
      await updateRoom(req, res);
  
      expect(Room.findOneAndUpdate).toHaveBeenCalledWith(
        { roomId: 'someRoomId' },
        {
          floorNo: 1,
          building: 'Building A',
          name: 'Room 101',
          capacity: 20,
          resources: ['Projector', 'Whiteboard']
        },
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Room updated successfully",
        course: mockUpdatedRoom
      });
    });
  
    it('should return 401 status and message if user is not admin', async () => {
      req.user.adminID = null;
  
      await updateRoom(req, res);
  
      expect(logger.warn).toHaveBeenCalledWith("Unauthorized access attempted in updateRoom");
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "You are not authorized as admin" });
    });
  
    it('should handle errors and return 500 status', async () => {
      const errorMessage = 'Some error occurred';
      const error = new Error(errorMessage);
      Room.findOne = jest.fn().mockRejectedValue(error);
  
      await updateRoom(req, res);
  
      expect(logger.error).toHaveBeenCalledWith("Error while updating Rooms", { error });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Internal server error"
      });
    });
  });

  describe('createRoom', () => {
    let req, res;
  
    beforeEach(() => {
      req = { 
        user: { adminID: 'someAdminID' },
        params: { roomId: 'someRoomId' },
        body: {
          floorNo: 1,
          building: 'Building A',
          name: 'Room 101',
          capacity: 20,
          resources: ['Projector', 'Whiteboard']
        }
      };
      res = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
    });
  
    it('should return 401 status and message if user is not admin', async () => {
      req.user.adminID = null;
  
      await createRoom(req, res);
  
      expect(logger.warn).toHaveBeenCalledWith("Unauthorized access attempted in createRoom");
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "You are not authorized as admin" });
    });
  
    it('should return 409 status if room already exists', async () => {
      Room.findOne = jest.fn().mockResolvedValue(true);
  
      await createRoom(req, res);
  
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Room already exists"
      });
    });
  
    it('should handle errors and return 500 status', async () => {
      const errorMessage = 'Some error occurred';
      const error = new Error(errorMessage);
      Room.findOne = jest.fn().mockRejectedValue(error);
  
      await createRoom(req, res);
  
      expect(logger.error).toHaveBeenCalledWith("Error while creating rooms", { error });
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Internal server error"
      });
    });
  });
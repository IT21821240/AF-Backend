const { getAllAdmins, deleteAdmin,updateAdmin, createAdmin, login, getAdmin } = require('../controllers/adminController');
const Admin = require('../models/admin'); 
const bcrypt = require('bcrypt');

describe('getAllAdmins', () => {
  it('should return all admins if user is admin', async () => {
    const mockAdmins = [
      { _id: 'admin1', name: 'Admin 1' },
      { _id: 'admin2', name: 'Admin 2' },
    ];

    jest.spyOn(Admin, 'find').mockResolvedValue(mockAdmins);

    const req = { user: { adminID: 'someAdminID' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await getAllAdmins(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "All Admins List",
      admins: mockAdmins,
    });
  });

  it('should return 401 status and message if user is not admin', async () => {
    const req = { user: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await getAllAdmins(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "You are not authorized as admin" });
  });

  it('should handle errors and return 500 status', async () => {
    const errorMessage = 'Database error';
    jest.spyOn(Admin, 'find').mockRejectedValue(new Error(errorMessage));

    const req = { user: { adminID: 'someAdminID' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await getAllAdmins(req, res);
  });
});

describe('deleteAdmin', () => {
    it('should delete admin successfully if user is admin', async () => {
      const mockAdminID = 'admin1';
  
      jest.spyOn(Admin, 'findOneAndDelete').mockResolvedValue({ adminID: mockAdminID });
  
      const req = { user: { adminID: 'someAdminID' }, params: { adminID: mockAdminID } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      await deleteAdmin(req, res);
  
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Admin deleted successfully",
      });
    });
  
    it('should return 401 status and message if user is not admin', async () => {
      const req = { user: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      await deleteAdmin(req, res);
  
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "You are not authorized as admin" });
    });
  
    it('should return 400 status and message if adminID is not provided', async () => {
      const req = { user: { adminID: 'someAdminID' }, params: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      await deleteAdmin(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, error: "Admin ID is required" });
    });
  
    it('should return 404 status if admin not found', async () => {
      jest.spyOn(Admin, 'findOneAndDelete').mockResolvedValue(null);
  
      const req = { user: { adminID: 'someAdminID' }, params: { adminID: 'nonExistentAdminID' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      await deleteAdmin(req, res);
  
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Admin not found" });
    });
  });

  describe('updateAdmin', () => {
    it('should update admin successfully if user is admin and admin exists', async () => {
      const mockAdminID = 'admin1';
      const mockUpdatedData = {
        fullName: 'John Doe',
        dob: '1990-01-01',
        address: '123 Street',
        phone: '1234567890',
        email: 'john@example.com',
        password: 'newpassword',
      };
      const mockHashedPassword = 'hashedPassword';
  
      const findOneMock = jest.spyOn(Admin, 'findOne').mockResolvedValue({ adminID: mockAdminID });
      const findOneAndUpdateMock = jest.spyOn(Admin, 'findOneAndUpdate').mockResolvedValue(mockUpdatedData);
      const bcryptHashMock = jest.spyOn(bcrypt, 'hash').mockResolvedValue(mockHashedPassword);
  
      const req = { 
        user: { adminID: 'someAdminID' }, 
        params: { adminID: mockAdminID },
        body: mockUpdatedData
      };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      await updateAdmin(req, res);
    });
  });

  describe('createAdmin', () => {
    it('should return 400 if required fields are missing or have invalid formats', async () => {
        const invalidAdminData = {
          email: 'invalidemail', 
          password: 'weakpassword', 
          phone: '12345',
        };
      
        const req = { body: invalidAdminData };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      
        await createAdmin(req, res);
      
      });

      it('should return 409 if admin already exists', async () => {
        const existingAdminData = {
          email: 'existing@admin.com',
        };
      
        jest.spyOn(Admin, 'findOne').mockResolvedValue(existingAdminData);
      
        const req = { body: existingAdminData };
        const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      
        await createAdmin(req, res);
      });
  });

  describe('login', () => {
    afterEach(() => {
      jest.clearAllMocks(); 
    });
    it('should return 401 if email is incorrect', async () => {
      jest.spyOn(Admin, 'findOne').mockResolvedValue(null); 
      const req = { body: { email: 'nonexistent@example.com', password: 'password123' } }; 
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
  
      await login(req, res); 
  
      expect(res.status).toHaveBeenCalledWith(401); 
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email' }); 
    });
  
    it('should return 401 if password is incorrect', async () => {
      const mockAdmin = { email: 'admin@example.com', password: 'correctPassword' };
      jest.spyOn(Admin, 'findOne').mockResolvedValue(mockAdmin); 
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false); 
      const req = { body: { email: 'admin@example.com', password: 'incorrectPassword' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
  
      await login(req, res); 
  
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid password' }); 
    });
  
    it('should return 500 if an error occurs', async () => {
      jest.spyOn(Admin, 'findOne').mockRejectedValue(new Error('Database error')); 
      const req = { body: { email: 'admin@example.com', password: 'correctPassword' } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
  
      await login(req, res); 
  
      expect(res.status).toHaveBeenCalledWith(500); 
      expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error' }); 
    });
  });

  
describe('getAdmin', () => {
    afterEach(() => {
      jest.clearAllMocks(); 
    });
  
    it('should return 401 if user is not authorized as admin', async () => {
      const req = { user: {} }; 
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
  
      await getAdmin(req, res); 
  
      expect(res.status).toHaveBeenCalledWith(401); 
      expect(res.json).toHaveBeenCalledWith({ message: 'You are not authorized as admin' }); 
    });
  
    it('should return 404 if admin is not found', async () => {
      const req = { user: { adminID: 'nonexistentAdminID' }, params: { adminID: 'nonexistentAdminID' } }; 
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
      jest.spyOn(Admin, 'findOne').mockResolvedValue(null); 
  
      await getAdmin(req, res); 
  
      expect(res.status).toHaveBeenCalledWith(404); 
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Admin not found' }); 
    });
  
    it('should return the admin if found', async () => {
      const mockAdmin = { adminID: 'adminID', fullName: 'John Doe', email: 'john@example.com' };
      const req = { user: { adminID: 'adminID' }, params: { adminID: 'adminID' } }; 
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      jest.spyOn(Admin, 'findOne').mockResolvedValue(mockAdmin); 
  
      await getAdmin(req, res); 
  
      expect(res.status).toHaveBeenCalledWith(200); 
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Retrieved Admin successfully', admin: mockAdmin }); 
    });
  });
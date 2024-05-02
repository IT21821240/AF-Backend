const { getAllFaculties, deleteFaculty, updateFaculty, createFaculty , facultyLogin} = require('../controllers/facultyController');
const Faculty = require("../models/faculty");

describe('getAllFaculties', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('should return 401 if user is not authorized as admin', async () => {
    const req = { user: {} }; 
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 

    await getAllFaculties(req, res); 

    expect(res.status).toHaveBeenCalledWith(401); 
    expect(res.json).toHaveBeenCalledWith({ message: 'You are not authorized as admin' }); 
  });

  it('should return all faculties if user is authorized as admin', async () => {
    const mockFaculties = [
      { facultyID: 'faculty1', name: 'Faculty A' },
      { facultyID: 'faculty2', name: 'Faculty B' },
    ];
    const req = { user: { adminID: 'adminID' } }; 
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
    jest.spyOn(Faculty, 'find').mockResolvedValue(mockFaculties); 

    await getAllFaculties(req, res); 
    expect(res.status).toHaveBeenCalledWith(200); 
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'All Faculties List', faculties: mockFaculties }); 
  });

  it('should handle errors and return 500 status', async () => {
    const req = { user: { adminID: 'adminID' } }; 
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
    jest.spyOn(Faculty, 'find').mockRejectedValue(new Error('Database error')); 

    await getAllFaculties(req, res); 
  });
});

describe('deleteFaculty', () => {
    afterEach(() => {
      jest.clearAllMocks(); 
    });
  
    it('should return 401 if user is not authorized as faculty', async () => {
      const req = { user: {} }; 
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
  
      await deleteFaculty(req, res); 
  
      expect(res.status).toHaveBeenCalledWith(401); 
      expect(res.json).toHaveBeenCalledWith({ message: 'You are not authorized as Faculty' }); 
    });
  
    it('should return 400 if facultyID is missing', async () => {
      const req = { user: { facultyID: 'facultyID' }, params: {} };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
  
      await deleteFaculty(req, res); 
  
      expect(res.status).toHaveBeenCalledWith(400); 
      expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Faculty ID is required' });
    });
  
    it('should return 404 if faculty not found', async () => {
      const req = { user: { facultyID: 'facultyID' }, params: { facultyID: 'nonexistentFacultyID' } }; 
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
      jest.spyOn(Faculty, 'findOneAndDelete').mockResolvedValue(null); 
  
      await deleteFaculty(req, res); 
      expect(res.status).toHaveBeenCalledWith(404); 
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Faculty not found' });
    });
  
    it('should delete faculty successfully', async () => {
      const req = { user: { facultyID: 'facultyID' }, params: { facultyID: 'existingFacultyID' } }; 
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
      jest.spyOn(Faculty, 'findOneAndDelete').mockResolvedValue({ facultyID: 'existingFacultyID' }); 
  
      await deleteFaculty(req, res); 
  
      expect(res.status).toHaveBeenCalledWith(200); 
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Faculty deleted successfully' }); 
    });
  });

  describe('updateFaculty', () => {
    afterEach(() => {
      jest.clearAllMocks(); 
    });
  
    it('should return 401 if user is not authorized as faculty', async () => {
      const req = { user: {} }; 
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      await updateFaculty(req, res); 
    });
  
    it('should return 400 if facultyID is missing', async () => {
      const req = { user: { facultyID: 'facultyID' }, params: {} }; 
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
  
      await updateFaculty(req, res); 
    });
  
    it('should return 404 if faculty not found', async () => {
      const req = { user: { facultyID: 'facultyID' }, params: { facultyID: 'nonexistentFacultyID' } }; 
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
      jest.spyOn(Faculty, 'findOne').mockResolvedValue(null); 
  
      await updateFaculty(req, res); 
    });
  });

  describe('createFaculty', () => {
    afterEach(() => {
      jest.clearAllMocks(); 
    });
  
    it('should return 400 if name is missing', async () => {
      const req = { body: { email: 'test@example.com', password: 'Test123!@#' } }; 
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
  
      await createFaculty(req, res); 
  
      expect(res.status).toHaveBeenCalledWith(400); 
      expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Name is required' }); 
    });
  
    it('should return 409 if faculty already exists', async () => {
      const req = { body: { fullName: 'Test Faculty', email: 'existing@example.com', password: 'Test123!@#' } }; 
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
      jest.spyOn(Faculty, 'findOne').mockResolvedValue({ email: 'existing@example.com' });
  
      await createFaculty(req, res); 
  
      expect(res.status).toHaveBeenCalledWith(409); 
      expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Faculty already exists' }); 
    });
  
    it('should create faculty successfully', async () => {
      const req = { body: { fullName: 'Test Faculty', email: 'new@example.com', password: 'Test123!@#' } }; 
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      const mockFaculty = { fullName: 'Test Faculty', email: 'new@example.com' }; 
      jest.spyOn(Faculty, 'findOne').mockResolvedValue(null); 
      jest.spyOn(Faculty, 'create').mockResolvedValue(mockFaculty); 
  
      await createFaculty(req, res); 
  
      expect(res.status).toHaveBeenCalledWith(201); 
      expect(res.json).toHaveBeenCalledWith({ success: true, message: 'New Faculty created', data: mockFaculty }); 
    });
  });

  describe('facultyLogin', () => {
    afterEach(() => {
      jest.clearAllMocks(); 
    });
  
    it('should return 401 if email is missing', async () => {
      const req = { body: { password: 'Test123!@#' } }; 
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      await facultyLogin(req, res); 
  
      expect(res.status).toHaveBeenCalledWith(401); 
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email' }); 
    });
  
    it('should return 401 if email is incorrect', async () => {
      const req = { body: { email: 'nonexistent@example.com', password: 'Test123!@#' } }; 
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
      jest.spyOn(Faculty, 'findOne').mockResolvedValue(null); 
  
      await facultyLogin(req, res); 
  
      expect(res.status).toHaveBeenCalledWith(401); 
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email' }); 
    });
  
    it('should return 401 if password is incorrect', async () => {
      const req = { body: { email: 'existing@example.com', password: 'IncorrectPassword' } }; 
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
      jest.spyOn(Faculty, 'findOne').mockResolvedValue({ email: 'existing@example.com', password: 'CorrectPassword' }); 
  
      await facultyLogin(req, res); 
  
      expect(res.status).toHaveBeenCalledWith(401); 
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid password' }); 
    });
  });
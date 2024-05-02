const {getStudent, deleteStudent , updateStudent, createStudent, studentLogin,  getAllStudents} = require('../controllers/studentController');
const Student = require("../models/student")
const logger = require("../utils/logger");

jest.mock('../utils/logger', () => ({
    warn: jest.fn(),
    error: jest.fn(),
  }));

describe('getStudent', () => {
  afterEach(() => {
    jest.clearAllMocks(); 
  });

  it('should return 404 if student is not found', async () => {
    const req = { user: { studentID: 'nonexistentStudentID' }, params: { studentID: 'nonexistentStudentID' } }; 
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
    jest.spyOn(Student, 'findOne').mockResolvedValue(null); 

    await getStudent(req, res); 

    expect(res.status).toHaveBeenCalledWith(404); 
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Student not found' }); 
  });

  it('should return student if found', async () => {
    const mockStudent = { studentID: 'existingStudentID', name: 'John Doe', email: 'john@example.com' }; 
    const req = { user: { studentID: 'existingStudentID' }, params: { studentID: 'existingStudentID' } }; 
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
    jest.spyOn(Student, 'findOne').mockResolvedValue(mockStudent); 

    await getStudent(req, res); 

    expect(res.status).toHaveBeenCalledWith(200); 
    expect(res.json).toHaveBeenCalledWith({ success: true, message: 'Retrieved Student successfully', student: mockStudent }); 
  });
});

describe('deleteStudent', () => {
    afterEach(() => {
      jest.clearAllMocks(); 
    });
  
    it('should return 401 if user is not authorized as student', async () => {
      const req = { user: {} }; 
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
  
      await deleteStudent(req, res); 
  
      expect(res.status).toHaveBeenCalledWith(401); 
      expect(res.json).toHaveBeenCalledWith({ message: 'You are not authorized as Student' }); 
    });
  
    it('should return 400 if studentID is missing', async () => {
      const req = { user: { studentID: 'studentID' }, params: {} }; 
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
  
      await deleteStudent(req, res); 
    });

    it('should delete student successfully', async () => {
      const req = { user: { studentID: 'studentID' }, params: { studentID: 'existingStudentID' } }; 
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
      jest.spyOn(Student, 'findOneAndDelete').mockResolvedValue({ facultyID: 'existingStudentID' }); 
  
      await deleteStudent(req, res); 
    });
  });

  describe('updateStudent', () => {
    afterEach(() => {
      jest.clearAllMocks(); 
    });
  
    it('should return 401 if user is not authorized as student', async () => {
      const req = { user: {} }; 
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      await updateStudent(req, res);
  
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'You are not authorized as Student' });
    });
  
    it('should return 400 if studentID is not provided', async () => {
      const req = { user: { studentID: 'someStudentID' }, params: {} }; 
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
      await updateStudent(req, res);
    });
  
    it('should return 404 if student does not exist', async () => {
      const req = { user: { studentID: 'someStudentID' }, params: { studentID: 'nonExistingStudentID' } }; 
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      jest.spyOn(Student, 'findOneAndUpdate').mockResolvedValue(null); 
  
      await updateStudent(req, res);
    });
  
  });

  describe('createStudent', () => {
    afterEach(() => {
      jest.clearAllMocks(); 
    });
    it('should return 400 if name is missing', async () => {
      const req = { body: { dob: '1990-01-01', address: '123 Street', phone: '+947123456789', email: 'john@example.com', password: 'Password@123' } }; 
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
      await createStudent(req, res);
  
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Name is required' });
    });
  
    it('should return 409 if student already exists', async () => {
      const req = { body: { fullName: 'John Doe', dob: '1990-01-01', address: '123 Street', phone: '+947123456789', email: 'john@example.com', password: 'Password@123' } }; // Mock request object
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
      jest.spyOn(Student, 'findOne').mockResolvedValue({ /* Mock existing student data */ }); // Mock findOne to return an existing student
      jest.spyOn(logger, 'warn'); // Mock logger.warn
  
      await createStudent(req, res);
    });
  
    it('should handle errors and return 500', async () => {
      const req = { body: { fullName: 'John Doe', dob: '1990-01-01', address: '123 Street', phone: '+947123456789', email: 'john@example.com', password: 'Password@123' } }; // Mock request object
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
      const error = new Error('Some error message'); 
      jest.spyOn(Student, 'findOne').mockRejectedValue(error); 
      jest.spyOn(logger, 'error');
  
      await createStudent(req, res);
    });
  });

  describe('studentLogin', () => {
    afterEach(() => {
      jest.clearAllMocks(); 
    });

    it('should return 401 for invalid email', async () => {
      const req = { body: { email: 'nonexistent@example.com', password: 'Password@123' } }; 
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      jest.spyOn(Student, 'findOne').mockResolvedValue(null); 
      jest.spyOn(logger, 'warn'); 
      jest.spyOn(logger, 'error'); 
  
      await studentLogin(req, res);
  
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Invalid email or password' });
      expect(logger.warn).toHaveBeenCalledWith('Invalid email during login attempt', { email: req.body.email });
      expect(logger.error).not.toHaveBeenCalled(); 
    });
  });

  describe('getAllStudents', () => {
    afterEach(() => {
      jest.clearAllMocks(); 
    });
  
    it('should return 401 when unauthorized', async () => {
      const req = { user: {} }; 
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() }; 
      jest.spyOn(logger, 'warn'); 
  
      await getAllStudents(req, res);
  
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'You are not authorized as admin' });
      expect(logger.warn).toHaveBeenCalledWith('Unauthorized access attempted in getAllStudents');
    });
  });
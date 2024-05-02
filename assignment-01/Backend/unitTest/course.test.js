const { getAllCourses, createCourse, updateCourse, deleteCourse } = require('../controllers/courseController');
const Course = require('../models/course'); 
const Faculty = require('../models/faculty');
const logger = require('../utils/logger');

logger.warn = jest.fn();
logger.error = jest.fn();


const req = {
  user: {
    adminID: 'admin123', 
  },
  params: {
    courseCode: 'CSE101', 
  },
  body: {
    name: 'Updated Course Name',
    description: 'Updated Course Description',
    credits: 4,
    faculties: ['faculty1', 'faculty2'], 
  },
};

const res = {
  status: jest.fn(() => res),
  json: jest.fn(),
};

jest.mock('../models/course');
Course.findOne = jest.fn();
Course.findOneAndUpdate = jest.fn();

jest.mock('../models/faculty');
Faculty.find = jest.fn();

describe('deleteCourse', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: {
        adminID: 'admin123'
      },
      params: {
        courseCode: 'CSE101'
      }
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn()
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a course successfully', async () => {
    // Mocking the Course.findOneAndDelete response
    Course.findOneAndDelete.mockResolvedValueOnce({
      _id: '123',
      courseCode: 'CSE101',
      name: 'Deleted Course',
      description: 'Course to be deleted',
      credits: 3,
      faculties: ['faculty1', 'faculty2'],
      createdAt: '2024-03-20T00:00:00.000Z',
      updatedAt: '2024-03-20T01:00:00.000Z'
    });

    await deleteCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Course deleted successfully',
      course: {
        _id: '123',
        courseCode: 'CSE101',
        name: 'Deleted Course',
        description: 'Course to be deleted',
        credits: 3,
        faculties: ['faculty1', 'faculty2'],
        createdAt: '2024-03-20T00:00:00.000Z',
        updatedAt: '2024-03-20T01:00:00.000Z'
      }
    });
  });

  it('should return 401 if user is not an admin', async () => {
    req.user.adminID = null;
    await deleteCourse(req, res);
    expect(logger.warn).toHaveBeenCalledWith('Unauthorized access attempted in deleteCourse');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'You are not authorized as admin' });
  });

  it('should return 404 if course is not found', async () => {
    Course.findOneAndDelete.mockResolvedValueOnce(null);
    await deleteCourse(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ success: false, error: 'Course not found' });
  });

  it('should handle internal server error', async () => {
    Course.findOneAndDelete.mockRejectedValueOnce(new Error('Database error'));
    await deleteCourse(req, res);
    expect(logger.error).toHaveBeenCalledWith('Error while deleting course', { err: expect.any(Error) });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Internal server error' });
  });
});

describe('updateCourse', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update a course successfully', async () => {
    // Mock the Course.findOne response
    Course.findOne.mockResolvedValueOnce({
      _id: '123',
      courseCode: 'CSE101',
      name: 'Original Course Name',
      description: 'Original Course Description',
      credits: 3,
      faculties: ['originalFaculty1', 'originalFaculty2'],
      createdAt: '2024-03-20T00:00:00.000Z',
      updatedAt: '2024-03-20T01:00:00.000Z',
    });

    // Mock the Faculty.find response
    Faculty.find.mockResolvedValueOnce([
      { facultyID: 'faculty1' },
      { facultyID: 'faculty2' },
    ]);

    // Mock the Course.findOneAndUpdate response
    Course.findOneAndUpdate.mockResolvedValueOnce({
      _id: '123',
      courseCode: 'CSE101',
      name: 'Updated Course Name',
      description: 'Updated Course Description',
      credits: 4,
      faculties: ['faculty1', 'faculty2'],
      createdAt: '2024-03-20T00:00:00.000Z',
      updatedAt: '2024-03-20T01:00:00.000Z',
    });

    // Call the function
    await updateCourse(req, res);

    // Assertions
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: 'Course updated successfully',
      course: {
        _id: '123',
        courseCode: 'CSE101',
        name: 'Updated Course Name',
        description: 'Updated Course Description',
        credits: 4,
        faculties: ['faculty1', 'faculty2'],
        createdAt: '2024-03-20T00:00:00.000Z',
        updatedAt: '2024-03-20T01:00:00.000Z',
      },
    });
  });
});


describe('createCourse function', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: {
        adminID: 'admin123'
      },
      body: {
        courseCode: 'CSE101',
        name: 'Introduction to Computer Science',
        description: 'An introductory course to computer science',
        credits: 3,
        faculties: ['faculty1', 'faculty2']
      }
    };
    res = {
      status: jest.fn(() => res),
      json: jest.fn()
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return 401 if user is not admin', async () => {
    req.user.adminID = null;
    await createCourse(req, res, next);
    expect(logger.warn).toHaveBeenCalledWith('Unauthorized access attempted in createCourse');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'You are not authorized as admin' });
  });

  test('should return 400 if required fields are missing', async () => {
    delete req.body.courseCode;
    await createCourse(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Missing required fields' });
  });

  test('should return 409 if course already exists', async () => {
    Course.findOne.mockResolvedValueOnce({});
    await createCourse(req, res, next);
    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Course already exists' });
  });

  test('should return 400 if invalid faculty IDs are provided', async () => {
    Faculty.find.mockResolvedValueOnce([{ facultyID: 'faculty1' }]);
    await createCourse(req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid faculty IDs provided' });
  });

  test('should return 500 if an error occurs', async () => {
    const error = new Error('Database error');
    Course.findOne.mockRejectedValueOnce(error);
    await createCourse(req, res, next);
    expect(logger.error).toHaveBeenCalledWith('Error while creating course', { err: expect.any(Error) });
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Internal server error' });
  });
});

describe('getAllCourses', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn(() => res),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return all courses', async () => {
    const mockCourses = [
      { _id: '1', courseCode: 'CS101', name: 'Introduction to Computer Science', description: 'An introductory course to computer science', credits: 3, faculties: ['John Doe', 'Jane Smith'] },
      { _id: '2', courseCode: 'MATH201', name: 'Calculus', description: 'A course on calculus', credits: 4, faculties: ['Alice Johnson', 'Bob Brown'] },
    ];
    Course.find.mockResolvedValue(mockCourses);

    await getAllCourses(req, res, next);

    expect(Course.find).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "All Courses List",
      courses: mockCourses,
    });
  });

  it('should handle errors', async () => {
    const mockError = new Error('Test error');
    Course.find.mockRejectedValue(mockError);

    await getAllCourses(req, res, next);

    expect(Course.find).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Internal server error",
    });
    expect(next).not.toHaveBeenCalled();
  });
});


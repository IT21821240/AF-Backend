const StudentEnrollment = require('../models/studentEnrollment'); 
const { enrollStudentInCourse , getStudentEnrollments, getEnrollmentsByCourse} = require("../controllers/studentEnrollmentControllers");

jest.mock('../models/studentEnrollment', () => ({
  findOne: jest.fn(),
  exists: jest.fn(),
  create: jest.fn(),
}));

describe('enrollStudentInCourse', () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: {
        studentID: 'someStudentID',
      },
      body: {
        studentId: 'someStudentId',
        courseId: 'someCourseId',
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

  it('should return 401 if user is not authorized as a student', async () => {
    req.user.studentID = undefined;
    await enrollStudentInCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "You are not authorized as student" });
  });

});

describe('getStudentEnrollments', () => {
  it('should return 401 status and message if user is not student', async () => {
      const req = {
          user: {},
      };
      const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn()
      };

      await getStudentEnrollments(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'You are not authorized as student' });
  });
});

describe('getEnrollmentsByCourse', () => {
  it('should return 401 status and message if user is not admin', async () => {
    const req = { user: {}, params: { courseId: 'someCourseID' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await getEnrollmentsByCourse(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "You are not authorized as admin" });
  });
});
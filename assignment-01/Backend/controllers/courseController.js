const Course = require("../models/course");
const Faculty = require("../models/faculty");
const logger= require("../utils/logger");

// Controller function to create a new course
const createCourse = async (req, res) => {
  try {
    // Check if the user is an admin
    if (!req.user.adminID) {
      logger.warn("Unauthorized access attempted in createCourse");
      return res
        .status(401)
        .json({ message: "You are not authorized as admin" });
    }
    const { courseCode, name, description, credits, faculties } = req.body;

    // Check if the required fields are provided
    if (!courseCode || !name || !description || !credits || !faculties) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if the course already exists
    const existingCourse = await Course.findOne({ courseCode });
    if (existingCourse) {
      return res.status(409).json({
        success: false,
        message: "Course already exists",
      });
    }
// Check if the provided faculty IDs are valid
    const existingFaculties = await Faculty.find({
      facultyID: { $in: faculties },
    });
    if (existingFaculties.length !== faculties.length) {
      return res.status(400).json({ message: "Invalid faculty IDs provided"});
    }
   // Create and save the new cours
    const course = new Course({
      courseCode,
      name,
      description,
      credits,
      faculties,
    });
    await course.save();
    if (course) {
      res.status(201).json({
        success: true,
        message: "Course created successfully",
        course,
      });
    } else {
      res.status(400).json({ success: false, error: "Course data not valid" });
    }
  } catch (err) {
    logger.error("Error while creating course", { err });
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Controller function to update a course by ID
const updateCourse = async (req, res) => {
    try {
       // Check if the user is an admin
      if (!req.user.adminID) {
        logger.warn("Unauthorized access attempted in updateCourse");
        return res
          .status(401)
          .json({ message: "You are not authorized as admin" });
      }
      const { courseCode } = req.params;
      const { name, description, credits, faculties } = req.body;

      const existingFaculties = await Faculty.find({
        facultyID: { $in: faculties },
      });
      if (existingFaculties.length !== faculties.length) {
        return res.status(400).json({ message: "Invalid faculty IDs provided" });
      }

  // Find the course by courseCode
     const course = await Course.findOne({courseCode: courseCode});
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }
  
        // Update the course
      const updatedCourse = await Course.findOneAndUpdate(
        {courseCode: courseCode},
        {name, description, credits, faculties },
        { new: true }
      );
  
      if (!updatedCourse) {
        return res.status(404).json({ success: false, error: "Course not found" });
      }
  
      console.log("Updated course:", updatedCourse);
      return res.status(200).json({
        success: true,
        message: "Course updated successfully",
        course: updatedCourse,
      });
    } catch (error) {
      console.error("Error while updating course:", error);
      logger.error("Error while updating course", { error });
      return res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  
  

// Controller function to delete a course by ID
const deleteCourse = async (req, res) => {
  try {
    // Check if the user is an admin
    if (!req.user.adminID) {
      logger.warn("Unauthorized access attempted in deleteCourse");
      return res
        .status(401)
        .json({ message: "You are not authorized as admin" });
    }
    const { courseCode } = req.params;
    const course = await Course.findOneAndDelete({ courseCode: courseCode });
    if (!course) {
      return res
        .status(404)
        .json({ success: false, error: "Course not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
      course,
    });
  } catch (err) {
    logger.error("Error while deleting course", { err });
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Controller function to get all courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json({
      success: true,
      message: "All Courses List",
      courses,
    });
  } catch (error) {
    logger.error("Error while getting all courses", { error });
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

// Controller function to get a course by ID
const getCourseById = async (req, res) => {
  try {
    // Check if the user is authorized
    if (!req.user.facultyID) {
      logger.warn("Unauthorized access attempted in getCourseById");
      return res
        .status(401)
        .json({ message: "You are not authorized as admin" });
    }
    const course = await Course.findOne({ courseCode: req.params.courseCode });
    if (!course) {
        return res.status(404).json({
            success: false,
            message: "Course not found",
        });
    }
    res.status(200).json({
        success: true,
        message: "Retrieved Course successfully",
        course, 
    });
} catch (error) {
  logger.error("Error while getting course by ID", { error });
    res.status(500).json({
        success: false,
        error,
        message: "Error while getting Course",
    });
}
};

// Controller function to get all courses assigned to a faculty
const getAllCoursesByFacultyId = async (req, res) => {
  try {
    // Check if the user is authorized as faculty
    const facultyId = req.user.facultyID;
    if (!facultyId) {
      logger.warn(
        `Unauthorized access: ${facultyId} is not authorized as faculty`
      );
      return res
        .status(401)
        .json({ message: "You are not authorized as faculty" });
    }
    const faculty = await Faculty.findOne({ facultyID: facultyId });
    if (!faculty) {
      return res
        .status(404)
        .json({ success: false, message: "Faculty not found" });
    }
    const courses = await Course.find({ faculties: facultyId });
    if (!courses || courses.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No courses found for this faculty" });
    }

    res.status(200).json({
      success: true,
      message: `Courses assigned to faculty with ID ${facultyId}`,
      courses,
    });
  } catch (error) {
    logger.error("Error getting courses:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = { createCourse, getAllCourses, updateCourse, deleteCourse , getCourseById, getAllCoursesByFacultyId};

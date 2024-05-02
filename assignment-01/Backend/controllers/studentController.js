const Student = require('../models/student');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isValidEmail, isValidPassword, isValidPhoneNumber } = require("../utils/commonFunctions");
const logger= require("../utils/logger");

// Controller function to create a new student
const createStudent = async (req, res) => {
    try {
        const { fullName, dob, address, phone, email, password } = req.body;
        
        if (!fullName || fullName.trim() === "") {
            logger.warn("Name is required during registration");
            return res.status(400).json({ success: false, error: "Name is required" });
        }

        if (!email || !isValidEmail(email)) {
            logger.warn("Invalid email format during registration");
            return res.status(400).json({ success: false, error: "Email should be in basic email format" });
        }

        if (!password || isValidPassword(password)) {
            logger.warn("Invalid password format during admin registration");
            return res.status(400).json({ success: false, error: "Password Should contain at least 10 characters, including at least one uppercase letter, one lowercase letter, one number, and one special character" });
        }

        if (!password || isValidPhoneNumber(phone)) {
            logger.warn("Invalid phone number during admin registration");
            return res.status(400).json({ success: false, error: "phone number should starts with country code +947 and is followed by 9 digits" });
        }

         // Check if the student already exists
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            logger.warn("Student already exists", { email });  
            return res.status(409).json({
                success: false,
                message: "Student already exists",
            });
        }

        // Hash the password before saving it to the database
        const hashedPassword = await bcrypt.hash(password, 10);
        const student = await Student.create({
            fullName,
            dob,
            address,
            phone,
            email,
            password: hashedPassword,
        });

        if (student) {
            logger.info("New student created successfully", { email });
            return res.status(201).json({ success: true, message: "New Student created", data: student });
        } else {
            logger.warn("Student data not valid", { email });
            return res.status(400).json({ success: false, error: "Student data not valid" });
        }
    } catch (error) {
        logger.error("Error while registering as Student", { error });
        return res.status(500).json({
            success: false,
            error,
            message: "Error while registering as Student",
        });
    }
};

// Controller function to get all students
const getAllStudents = async (req, res) => {
    try {
        // Check if the request is made by an admin
        if (!req.user.adminID) {
            logger.warn("Unauthorized access attempted in getAllStudents");
            return res
              .status(401)
              .json({ message: "You are not authorized as admin" });
          }

          // Retrieve all students from the database
        const students = await Student.find();
        logger.info("Retrieved all Students successfully", { students });
        res.status(200).json({
            success: true,
            message: "All Students List",
            students,
        });
    } catch (error) {
        logger.error("Error while getting all Students", { error });
        res.status(500).json({
            success: false,
            error,
            message: "Error while getting all Students",
        });
    }
};

// Controller function to get a student by ID
const getStudent = async (req, res) => {
    try {
         // Check if the request is made by a student
        if (!req.user.studentID) {
            logger.warn("Unauthorized access attempted in getStudent");
            return res
              .status(401)
              .json({ message: "You are not authorized as Student" });
          }

          if (req.user.studentID !== req.params.studentID) {
            logger.warn(
              `Unauthorized access: User ID ${req.user.studentID} does not match student ID ${req.params.studentID}`
            );
            return res
              .status(401)
              .json({ message: "You are not authorized to access this student" });
          }

        const student = await Student.findOne({studentID: req.params.studentID});
        if (!student) {
            logger.warn("Student not found in getStudent", { studentID: req.params.studentID });
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Retrieved Student successfully",
            student, 
        });
    } catch (error) {
        logger.error("Error while getting Student", { error });
        res.status(500).json({
            success: false,
            error,
            message: "Error while getting Student",
        });
    }
};

// Controller function to update a student by ID
const updateStudent = async (req, res) => {
    try {
        // Check if the request is made by a student
        if (!req.user.studentID) {
            logger.warn("Unauthorized access attempted in updateStudent");
            return res
              .status(401)
              .json({ message: "You are not authorized as Student" });
          }
        const { fullName, dob, address, phone, email, password } = req.body;
        const { studentID } = req.params;

        // Check if studentID is provided
        if (!studentID) {
            logger.warn("Student ID is required in updateStudent");
            return res.status(400).json({ success: false, error: "Student ID is required" });
        }

        if (req.user.studentID !== studentID) {
            logger.warn(
              `Unauthorized access: User ID ${req.user.studentID} does not match student ID ${studentID}`
            );
            return res
              .status(401)
              .json({ message: "You are not authorized to access this student" });
          }
        
        // Check if the student exists
        const student = await Student.findOne({studentID: studentID});
        if (!student) {
            logger.warn("Student not found in updateStudent", { studentID });
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }

        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        const updatedStudent = await Student.findOneAndUpdate(
            {studentID: studentID},
            { fullName, dob, address, phone, email, password: hashedPassword },
            { new: true }
        );
        res.status(200).json({
            success: true,
            message: "Student Updated Successfully",
            updatedStudent, // Fixed variable name here
        });
    } catch (error) {
        logger.error("Error while updating student", { error });
        res.status(500).json({
            success: false,
            error,
            message: "Error while updating Student",
        });
    }
};

// Controller function to delete a student by ID
const deleteStudent = async (req, res) => {
    try {
        if (!req.user.adminID) {
            logger.warn("Unauthorized access attempted in deleteStudent");
            return res
              .status(401)
              .json({ message: "You are not authorized as Student" });
          }
          
        const { studentID } = req.params;
        // Check if studentID is provided
        if (!studentID) {
            logger.warn("Student ID is required in deleteStudent");
            return res.status(400).json({ success: false, error: "Student ID is required" });
        }
        const student = await Student.findOneAndDelete({studentID: studentID});
        if (!student) {
            logger.warn("Student not found");
            return res.status(404).json({
                success: false,
                message: "Student not found",
            });
        }
        logger.info("Student deleted successfully");
        res.status(200).json({
            success: true,
            message: "Student deleted successfully",
        });
    } catch (error) {
        logger.error("Error in deleting Student", { error });
        res.status(500).json({
            success: false,
            error,
            message: "Error in deleting Student",
        });
    }
};

// Controller function to student login
async function studentLogin(req, res) { 
    try {
      const { email, password } = req.body;
  
      const student = await Student.findOne({ email });
      if (!student) {
        logger.warn("Invalid email during login attempt", { email });
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, student.password);
      if (!isPasswordValid) {
        logger.warn("Invalid password during login attempt", { email });
        return res.status(401).json({ message: 'Invalid email or password' });
      }
  
      const token = jwt.sign(
        {
            student: {
                studentID: student.studentID,
                email: student.email, 
                id: student.id,
            },  
        }, 
        process.env.JWT_SECRET, {expiresIn: '1y' });
      return res.json({ token });
    } catch (error) {
      logger.error("Internal server error during login attempt", { error });
      return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = { createStudent, getAllStudents, getStudent, updateStudent, deleteStudent, studentLogin};
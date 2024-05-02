const Faculty = require('../models/faculty');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { isValidEmail, isValidPassword, isValidPhoneNumber } = require("../utils/commonFunctions");
const logger= require("../utils/logger");

// Controller function to create a new faculty
const createFaculty = async (req, res) => {
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

        // Check if the faculty with the same email already exists
        const existingFaculty = await Faculty.findOne({ email });
        if (existingFaculty) {
            logger.warn("Faculty already exists", { email });  
            return res.status(409).json({
                success: false,
                message: "Faculty already exists",
            });
        }

         // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const faculty = await Faculty.create({
            fullName,
            dob,
            address,
            phone,
            email,
            password: hashedPassword,
        });

        if (faculty) {
            logger.info("New faculty created successfully", { email });
            return res.status(201).json({ success: true, message: "New Faculty created", data: faculty });
        } else {
            logger.warn("Faculty data not valid", { email });
            return res.status(400).json({ success: false, error: "Faculty data not valid" });
        }
    } catch (error) {
        logger.error("Error while registering as Faculty", { error });
        return res.status(500).json({
            success: false,
            error,
            message: "Error while registering as Faculty",
        });
    }
};

// Controller function to get all faculties
const getAllFaculties = async (req, res) => {
    try {
        // Check if the user is an admin
        if (!req.user.adminID) {
            logger.warn("Unauthorized access attempted in getAllFaculties");
            return res
              .status(401)
              .json({ message: "You are not authorized as admin" });
          }

        // Retrieve all faculties
        const faculties = await Faculty.find();
        logger.info("Retrieved all Faculties successfully", { faculties });
        res.status(200).json({
            success: true,
            message: "All Faculties List",
            faculties,
        });
    } catch (error) {
        logger.error("Error while getting all Faculties", { error });
        res.status(500).json({
            success: false,
            error,
            message: "Error while getting all Faculties",
        });
    }
};

// Controller function to get a faculty by ID
const getFaculty = async (req, res) => {
    try {
        // Check if the user is authorized as faculty
        if (!req.user.facultyID) {
            logger.warn("Unauthorized access attempted in getFaculty");
            return res
              .status(401)
              .json({ message: "You are not authorized as Faculty" });
          }

          // Find the faculty by ID
        const faculty = await Faculty.findOne({ facultyID: req.params.facultyID });
        if (!faculty) {
            logger.warn("Faculty not found in getAdmin", { facultyID: req.params.facultyID });
            return res.status(404).json({
                success: false,
                message: "Faculty not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Retrieved Faculty successfully",
            faculty, 
        });
    } catch (error) {
        logger.error("Error while getting Faculty", { error });
        res.status(500).json({
            success: false,
            error,
            message: "Error while getting Faculty",
        });
    }
};

// Controller function to update a faculty by ID
const updateFaculty = async (req, res) => {
    try {
        // Check if the user is authorized as faculty
        if (!req.user.facultyID) {
            logger.warn("Unauthorized access attempted in updateFaculty");
            return res
              .status(401)
              .json({ message: "You are not authorized as Faculty" });
          }

        const { fullName, dob, address, phone, email, password } = req.body;
        const { facultyID } = req.params;

        // Check if facultyID is provided
        if (!facultyID) {
            logger.warn("Faculty ID is required in updateFaculty");
            return res.status(400).json({ success: false, error: "Faculty ID is required" });
        }
        if (req.user.facultyID !== facultyID) {
            logger.warn(
              `Unauthorized access: User ID ${req.user.facultyID} does not match faculty ID ${facultyID}`
            );
            return res
              .status(401)
              .json({ message: "You are not authorized to access this faculty" });
          }
        
        // Check if the faculty exists
        const faculty = await Faculty.findOne({facultyID: facultyID});
        if (!faculty) {
            logger.warn("Faculty not found in updateFaculty", { facultyID });
            return res.status(404).json({
                success: false,
                message: "Faculty not found",
            });
        }

        // Hash the password if provided
        let hashedPassword;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Update the faculty
        const updatedFaculty = await Faculty.findOneAndUpdate(
            {facultyID: facultyID},
            { fullName, dob, address, phone, email, password: hashedPassword },
            { new: true }
        );
        res.status(200).json({
            success: true,
            message: "Faculty Updated Successfully",
            updatedFaculty, // Fixed variable name here
        });
    } catch (error) {
        logger.error("Error while updating faculty", { error });
        res.status(500).json({
            success: false,
            error,
            message: "Error while updating Faculty",
        });
    }
};

// Controller function to delete a faculty by ID
const deleteFaculty = async (req, res) => {
    try {
        // Check if the user is authorized as faculty
        if (!req.user.facultyID) {
            logger.warn("Unauthorized access attempted in deleteFaculty");
            return res
              .status(401)
              .json({ message: "You are not authorized as Faculty" });
          }
          
        const { facultyID } = req.params;
        // Check if facultyID is provided
        if (!facultyID) {
            logger.warn("Faculty ID is required in deleteFaculty");
            return res.status(400).json({ success: false, error: "Faculty ID is required" });
        }
        const faculty = await Faculty.findOneAndDelete({facultyID: facultyID});
        if (!faculty) {
            logger.warn("Faculty not found in deleteFaculty", { facultyID });
            return res.status(404).json({
                success: false,
                message: "Faculty not found",
            });
        }
        logger.info("Faculty deleted successfully", { facultyID });
        res.status(200).json({
            success: true,
            message: "Faculty deleted successfully",
        });
    } catch (error) {
        logger.error("Error in deleting Faculty", { error });
        res.status(500).json({
            success: false,
            error,
            message: "Error in deleting Faculty",
        });
    }
};

//controller for faculty login
async function facultyLogin(req, res) {
    try {
        const { email, password } = req.body;
  
        const faculty = await Faculty.findOne({ email });
        if (!faculty) {
          logger.warn("Invalid email during login attempt", { email });
          return res.status(401).json({ message: 'Invalid email' });
        }
    
        const isPasswordValid = await bcrypt.compare(password, faculty.password);
        if (!isPasswordValid) {
          logger.warn("Invalid password during login attempt", { email });
          return res.status(401).json({ message: 'Invalid password' });
        }
    
        const token = jwt.sign(
          {
            faculty: {
              facultyID: faculty.facultyID,
              email: faculty.email,
              id: faculty.id,
            },
          }, process.env.JWT_SECRET, { expiresIn: '1y' });
        console.log("Faculty Logged in successfully!");
        return res.json({ token });
    } catch (error) {
        logger.error("Internal server error during login attempt", { error });
        return res.status(500).json({ message: 'Internal server error' });
    }
;}


module.exports = { createFaculty, getAllFaculties, getFaculty, updateFaculty, deleteFaculty, facultyLogin };

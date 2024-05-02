const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger= require("../utils/logger");
const { isValidEmail, isValidPassword, isValidPhoneNumber } = require('../utils/commonFunctions');

// Controller function to create a new admin
const createAdmin = async (req, res) => {
    try {
        const { fullName, dob, address, phone, email, password } = req.body;
        
        if (!fullName || fullName.trim() === "") {
            logger.warn("Name is required during admin registration");
            return res.status(400).json({ success: false, error: "Name is required" });
        }

        if (!email || !isValidEmail(email)) {
            logger.warn("Invalid email format during admin registration");
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

        // Check if admin already exists
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) { 
            logger.warn("Admin already exists", { email });       
            return res.status(409).json({
                success: false,
                message: "Admin already exists",
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = await Admin.create({
            fullName,
            dob,
            address,
            phone,
            email,
            password: hashedPassword,
        });

        if (admin) {
            logger.info("New admin created successfully", { email });
            return res.status(201).json({ success: true, message: "New Admin created", data: admin });
        } else {
            logger.warn("Admin data not valid", { email });
            return res.status(400).json({ success: false, error: "Admin data not valid" });
        }
    } catch (error) {
        logger.error("Error while registering as Admin", { error });
        return res.status(500).json({
            success: false,
            error,
            message: "Error while registering as Admin",
        });
        
    }
};

// Controller function to get all admins
const getAllAdmins = async (req, res) => {
    try {
        // Check if the user is an admin
        if (!req.user.adminID) {
            logger.warn("Unauthorized access attempted in getAllAdmins");
            return res
              .status(401)
              .json({ message: "You are not authorized as admin" });
          }

          // Retrieve all admins
        const admins = await Admin.find();
        logger.info("Retrieved all Admins successfully", { admins });
        res.status(200).json({
            success: true,
            message: "All Admins List",
            admins,
        });
    } catch (error) {
        logger.error("Error while getting all Admins", { error });
        res.status(500).json({
            success: false,
            error,
            message: "Error while getting all Admins",
        });
    }
};

// Controller function to get a specific admin
const getAdmin = async (req, res) => {
    try {
        // Check if the user is an admin
        if (!req.user.adminID) {
            logger.warn("Unauthorized access attempted in getAdmin");
            return res
              .status(401)
              .json({ message: "You are not authorized as admin" });
          }

          // Retrieve the admin by ID
        const admin = await Admin.findOne({ adminID: req.params.adminID });
        if (!admin) {
            logger.warn("Admin not found in getAdmin", { adminID: req.params.adminID });
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "Retrieved Admin successfully",
            admin,
        });
    } catch (error) {
        logger.error("Error while getting Admin", { error });
        res.status(500).json({
            success: false,
            error,
            message: "Error while getting Admin",
        });
    }
};

// Controller function to update admin details
const updateAdmin = async (req, res) => {
    try {
        // Check if the user is an admin
        if (!req.user.adminID) {
            logger.warn("Unauthorized access attempted in updateAdmin");
            return res
              .status(401)
              .json({ message: "You are not authorized as admin" });
          }

        const { fullName, dob, address, phone, email, password } = req.body;
        const { adminID } = req.params;

        // Check if adminID is provided
        if (!adminID) {
            logger.warn("Admin ID is required in updateAdmin");
            return res.status(400).json({ success: false, error: "Admin ID is required" });
        }
        if (req.user.adminID !== adminID) {
            logger.warn(
              `Unauthorized access: User ID ${req.user.adminID} does not match admin ID ${adminID}`
            );
            return res
              .status(401)
              .json({ message: "You are not authorized to access this admin" });
          }
        
        // Check if the admin exists
        const admin = await Admin.findOne({ adminID: adminID });
        if (!admin) {
            logger.warn("Admin not found in updateAdmin", { adminID });
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }

        // Hash the password if it's provided
        let updatedData = { fullName, dob, address, phone, email };
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            updatedData.password = hashedPassword;
        }

        // Update the admin details
        const updatedAdmin = await Admin.findOneAndUpdate(
            { adminID: adminID },
            updatedData,
            { new: true }
        );
        res.status(200).json({
            success: true,
            message: "Admin Updated Successfully",
            updatedAdmin,
        });
    } catch (error) {
        logger.error("Error while updating admin", { error });
        res.status(500).json({
            success: false,
            error,
            message: "Error while updating admin",
        });
    }
};

// Controller function to delete an admin
const deleteAdmin = async (req, res) => {
    try {
        // Check if the user is an admin
        if (!req.user.adminID) {
            logger.warn("Unauthorized access attempted in deleteAdmin");
            return res
              .status(401)
              .json({ message: "You are not authorized as admin" });
          }
          
        const { adminID } = req.params;
        // Check if adminID is provided
        if (!adminID) {
            logger.warn("Admin ID is required in deleteAdmin");
            return res.status(400).json({ success: false, error: "Admin ID is required" });
        }
        const admin = await Admin.findOneAndDelete({ adminID: adminID });
        if (!admin) {
            logger.warn("Admin not found in deleteAdmin", { adminID });
            return res.status(404).json({
                success: false,
                message: "Admin not found",
            });
        }
        logger.info("Admin deleted successfully", { adminID });
        res.status(200).json({
            success: true,
            message: "Admin deleted successfully",
        });
    } catch (error) {
        logger.error("Error in deleting admin", { error });
        res.status(500).json({
            success: false,
            error,
            message: "Error in deleting admin",
        });
    }
};

async function login(req, res) {
    try {
      const { email, password } = req.body;

      const admin = await Admin.findOne({ email });
      if (!admin) {
        logger.warn("Invalid email during login attempt", { email });
        return res.status(401).json({ message: 'Invalid email' });
      }
  
      const isPasswordValid = await bcrypt.compare(password, admin.password);
      if (!isPasswordValid) {
        logger.warn("Invalid password during login attempt", { email });
        return res.status(401).json({ message: 'Invalid password' });
      }
  
      const token = jwt.sign(
        {
        admin: {
        adminID: admin.adminID,
        email: admin.email,
        id: admin.id,
      },
      }, process.env.JWT_SECRET, { expiresIn: '1y' });
      console.log("Admin Logged in successfully!");
      return res.json({ token });
    } catch (error) {
      logger.error("Internal server error during login attempt", { error });
      return res.status(500).json({ message: 'Internal server error' });
    }
};


module.exports = { createAdmin, getAllAdmins, getAdmin, updateAdmin, deleteAdmin ,login };

const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    adminID: {
        type: String,
        unique: true
    },
    fullName: { 
        type: String, 
        required: true 
    },
    dob:{
        type:Date,
        required: true,
    },
    address:{
        type:String,
        required: true,    
    },
    phone:{
        type:String,
        required: true,
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    password: { 
        type: String, 
        required: true 
    }
},
{
  timestamps: true,
}
);

adminSchema.pre("save",async function (next) {
  const admin = this;
  if (!admin.isNew) {
      return next();
  }
  try {
      const count = await admin.constructor.countDocuments({});
      admin.adminID = `AD${2000 + count}`;
      next();
  } catch (error) {
      return next(error);
  }
});
    const Admin = mongoose.model('Admin', adminSchema);
  
     module.exports = Admin;
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    studentID: {
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

  studentSchema.pre("save",async function (next) {
    const student = this;
    if (!student.isNew) {
      return next();
    }
    try{
      const count = await student.constructor.countDocuments({});
      student.studentID = `IT${2400 + count}`;
      next();
    }catch(error){
      return next(error);
    }
  });
  
  const Student = mongoose.model('Student', studentSchema);
  
  module.exports = Student;
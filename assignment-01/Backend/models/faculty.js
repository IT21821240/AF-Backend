const mongoose = require('mongoose');

const facultySchema = new mongoose.Schema({
    facultyID: {
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

facultySchema.pre("save",async function (next) {
const faculty = this;
if (!faculty.isNew) {
  return next();
}
try{
  const count = await faculty.constructor.countDocuments({});
  faculty.facultyID = `F${1000 + count}`;
  next();

}catch(error){
    return next(error);
}
});


const Faculty = mongoose.model('Faculty', facultySchema);
  
module.exports = Faculty;
const mongoose = require('mongoose');

const studentEnrollmentSchema = new mongoose.Schema({
  studentId: {
    type: String,
  },
  courseId: {
    type: String,
    required: true,
  },
},
{
  timestamps: true,
}
);

  const StudentEnrollment = mongoose.model('StudentEnrollment', studentEnrollmentSchema);
  
  module.exports = StudentEnrollment;
const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  courseId: { 
     type:String,
     required: true
  },
  day: {
    type: Number,
    min: 1,
    max: 7,
    required: true, 
  },
  startTime: {
    hours: {
      type: Number,
      required: true,
    },
    minutes: {
      type: Number,
      required: true,
    },
  },
  endTime: {
    hours: {
      type: Number,
      required: true,
    },
    minutes: {
      type: Number,
      required: true,
    },
  },
  facultyId: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
},
{
  timestamps: true,
}
);

const Timetable = mongoose.model('Timetable', timetableSchema);
  
module.exports = Timetable;
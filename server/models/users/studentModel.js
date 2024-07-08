const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    minlength: 6,
    required: true,
  },
  profilepic: {
    type: String,
    default: "",
  },
  enrolled: [
    {
      coursesAvailable: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
      },
      isComplete: {
        type: Boolean,
        default: false,
      },
    },
  ],

  completedCourses: [
    {
      courses: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "course",
      },
    },
  ],
});

const studentModel = mongoose.model("student", studentSchema);
module.exports = studentModel;

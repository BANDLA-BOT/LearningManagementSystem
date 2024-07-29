const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
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
    lowercase:true,
    unique:true,
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
  courseRequests:[
    {
      courseId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'course'
      },
      studentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"student"
      },
      paid:{
        type:Boolean,
        default:false
      },
      accept:{
        type:Boolean,
        default:false
      }
    }
  ]
},{timestamps:true});

const adminModel = mongoose.model("admin", adminSchema);
module.exports = adminModel;

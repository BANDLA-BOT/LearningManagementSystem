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
},{timestamps:true});

const adminModel = mongoose.model("admin", adminSchema);
module.exports = adminModel;

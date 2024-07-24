"use strict";

var mongoose = require('mongoose');

var instructor = new mongoose.Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    min: 6
  },
  profilePic: {
    type: String
  }
});
var instructorModel = mongoose.model('instructor', instructor);
module.exports = instructorModel;
//# sourceMappingURL=instructorModel.dev.js.map

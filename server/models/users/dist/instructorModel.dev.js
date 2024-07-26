"use strict";

var mongoose = require('mongoose');

var qualificationSchema = mongoose.Schema({
  degree: [{
    degreeName: {
      type: String
    },
    year: {
      type: Number
    }
  }],
  skills: [{
    skillName: {
      type: String,
      "enum": ['Software engineering, Full stack development, Deveps, cloud engineering, data science, ']
    }
  }]
});
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
  },
  about: {
    type: String
  },
  qualification: []
});
var instructorModel = mongoose.model('instructor', instructor);
module.exports = instructorModel;
//# sourceMappingURL=instructorModel.dev.js.map

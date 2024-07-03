"use strict";

var mongoose = require('mongoose');

var studentSchema = new mongoose.Schema({
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
    required: true
  },
  password: {
    type: String,
    minlength: 6,
    required: true
  },
  profilepic: {
    type: String,
    "default": ''
  },
  enrolled: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'course'
  }]
});
var studentModel = mongoose.model('student', studentSchema);
module.exports = studentModel;
//# sourceMappingURL=studentModel.dev.js.map

"use strict";

var mongoose = require("mongoose");

var adminSchema = new mongoose.Schema({
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
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    type: String,
    minlength: 6,
    required: true
  },
  profilepic: {
    type: String,
    "default": ""
  }
}, {
  timestamps: true
});
var adminModel = mongoose.model("admin", adminSchema);
module.exports = adminModel;
//# sourceMappingURL=adminModel.dev.js.map

"use strict";

var mongoose = require("mongoose");

var videoSchema = new mongoose.Schema({
  title: String,
  url: String,
  completed: {
    type: Boolean,
    "default": false
  }
});
var sectionSchema = new mongoose.Schema({
  title: String,
  thumbnail: String,
  videos: [videoSchema]
});
var courseSchema = new mongoose.Schema({
  title: {
    type: String || 'untitled',
    required: true
  },
  price: {
    type: Number,
    required: true,
    "default": 0
  },
  rating: {
    type: Number,
    max: 5,
    "default": 0
  },
  reviews: [{
    reviewBy: {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "student"
      },
      review: {
        type: String
      }
    }
  }],
  resources: [String],
  description: {
    type: String
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "instructor"
  },
  section: [sectionSchema]
});
var coureModel = mongoose.model("course", courseSchema);
module.exports = coureModel;
//# sourceMappingURL=courseModel.dev.js.map

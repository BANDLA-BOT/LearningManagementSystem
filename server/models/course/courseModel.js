const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: String,
  url: String,
  completed: { type: Boolean, default: false },
});

const sectionSchema = new mongoose.Schema({
  title: String,
  thumbnail: String,
  videos: [videoSchema],
});
const courseSchema = new mongoose.Schema({
  title: {
    type: String || "untitled",
    required: true,
  },
  price: {
    type: Number,
    required: true,
    default: 0,
  },
  rating: [{
    rate:{
      type:Number,
      min:1,
      max:5,
      default:1
    },
    ratedBy:{
      type:mongoose.Schema.Types.ObjectId,
      ref:'student'
    }
  }
  ],
  reviews: [
    {
      reviewBy: {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "student",
        },
        review: {
          type: String,
        },
        // rating:{
        //   type:Number,
        //   min:1,
        //   max:5,
        //   default:1
        // }
      },
    },
  ],
  resources: [
    {
      title: String,
      url: String,
    },
  ],
  description: {
    type: String,
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "instructor",
  },
  section: [sectionSchema],
});

const coureModel = mongoose.model("course", courseSchema);
module.exports = coureModel;

const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  reviews: [
    {
      reviewBy:{
        userId:{
          type:mongoose.Schema.Types.ObjectId,
          ref:'student'
        },
        review:{
          type:String,
        }
      }
    }
  ],
  resources: [
    {
      type: String,
    },
  ],
  description: {
    type: String,
  },
  instructor: {
    type:mongoose.Schema.Types.ObjectId,
    ref: "instructor",
  },
  section: [
    {
      title: {
        type: String,
        required: true,
      },
      videos: [
        {
          title: {
            type: String,
          },
          thumbnail: {
            type: String,
          },
          videoFile: {
            type: String,
          },
        },
      ],
    },
  ],
});


const coureModel = mongoose.model('course', courseSchema)
module.exports = coureModel
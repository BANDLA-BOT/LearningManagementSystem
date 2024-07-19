const courseModel = require('../../models/course/courseModel.js')

const deleteReview = async (req, res) => {
    try {
      const { courseId, reviewId } = req.params;
      const course = await courseModel.findById(courseId);
      const reviews = course.reviews;
      const reviewDelete = reviews.map(async (item) => {
        if (item._id.toString() === reviewId) {
          await item.deleteOne({ reviewId });
        }
      });
      await course.save();
  
      res.json(reviewDelete);
    } catch (error) {
      res.json(error.message);
    }
  };

module.exports = { deleteReview }
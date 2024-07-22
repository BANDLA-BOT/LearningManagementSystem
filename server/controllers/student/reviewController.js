const courseModel = require("../../models/course/courseModel");
const studentModel = require("../../models/users/studentModel.js");

const reviewController = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user;
  const { review } = req.body;
  try {
    const course = await courseModel.findById(courseId);
    const student = await studentModel.findById({ _id: userId.id });
    if (!course || !student) {
      return res.status(404).json({ message: "Course not found" });
    }
    course.reviews.push({
      reviewBy: {
        userId: student._id,
        review,
      },
    });
    await course.save();
    res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { reviewController};

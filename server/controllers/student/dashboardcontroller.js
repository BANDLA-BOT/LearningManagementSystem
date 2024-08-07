const Student = require("../../models/users/studentModel.js");
const courseModel = require("../../models/course/courseModel.js");
const adminModel = require("../../models/users/adminModel.js");

//Dashboard
const getProfile = async (req, res) => {
  const id = req.user;
  try {
    const student = await Student.findById({ _id: id.id }).select("-password");
    const courses = await courseModel.find().limit(61);
    if (!student) {
      return res.json({ message: "No student found " });
    }
    if (!courses) {
      return res.json({ message: "No courses available currently" });
    }
    res.json({
      message: "Students Profile",
      Profile: student,
      courses: courses,
      porfileStatus: true,
    });
  } catch (error) {
    res
      .status(500)
      .json({ Message: "Internal server error", Error: error.message });
  }
};
const editProfile = async (req, res) => {
  try {
    const { email, firstname, lastname } = req.body;
    const userId = req.user.id;
    const student = await Student.updateOne(
      { _id: userId },
      { $set: { firstname: firstname, lastname: lastname, email: email } }
    );
    res.status(200).json({ message: "Profile updated successfuly" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", Error: error.message });
  }
};
const editPassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword, reEnterNewPassword } = req.body;
    const student = await Student.findById(userId);
    if (currentPassword !== student.password) {
      return res.json({ message: "You have entered wrong current password" });
    }
    if (newPassword === student.password) {
      return res.json({
        message: "New password should be different from Old password",
      });
    }
    if (newPassword !== reEnterNewPassword) {
      return res.json({
        message: "Confirm password should same as New password",
      });
    }
    student.password = newPassword;
    await student.save();
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", Error: error.message });
  }
};
const enrollCourse = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user;
  const course = await courseModel.findById({ _id: courseId });
  const admin = await adminModel.findOne();
  const student = await Student.findById({ _id: userId.id });
  try {
    if (!student) {
      return res.status(400).json({ message: "Student not found" });
    }
    if (!course) {
      return res.status(400).json({ message: "Course not found" });
    }
    const Course = student.enrolled;
    const available = Course.some((course) =>
      course.coursesAvailable.equals(courseId)
    );
    if (available) {
      return res.json({ Message: "You have already enrolled this course" });
    }
    admin.courseRequests.push({
      courseId: course._id,
      studentId: student._id,
      paid: true,
    });
    await admin.save();
    res
      .status(200)
      .json({
        Message:
          "Request sent to the Admin, check your EnrolledList after sometime",
      });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", Error: error.message });
  }
};
const showEnrolled = async (req, res) => {
  const userId = req.user;
  try {
    const student = await Student.findById({ _id: userId.id }).populate(
      "enrolled.coursesAvailable"
    );
    if (!student) return res.status(404).json({ message: "Student not found" });
    res.status(200).json({ message: "Found", List: student.enrolled });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const topRanks = async (req, res) => {
  try {
    const students = await Student.aggregate([
      {
        $match: {
          "enrolled.isComplete": true,
        },
      },
      {
        $addFields: {
          Count: {
            $size: {
              $filter: {
                input: "$enrolled",
                as: "enrolled",
                cond: { $eq: ["$$enrolled.isComplete", true] },
              },
            },
          },
        },
      },
      {
        $sort: { _id: -1 },
      },

      {
        $project: {
          firstname: 1,
          lastname: 1,
          Count: 1,
        },
      },
    ]);
    res.status(200).json({ rankings: students });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
const markVideoAsComplete = async (req, res) => {
  try {
    const { courseId, videoId } = req.params;
    const userId = req.user.id;
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const student = await Student.findById(userId).populate(
      "enrolled.coursesAvailable"
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const enrolledCourses = student.enrolled;
    console.log(enrolledCourses);
    const enrolledCourse = student.enrolled.find((enroll) =>
      enroll.coursesAvailable.equals(courseId)
    );
    console.log(enrolledCourse);
    if (!enrolledCourse) {
      return res
        .status(404)
        .json({ message: "Course not enrolled by the student" });
    }

    const alreadyCompleted = enrolledCourse.completedVideos.find(
      (cv) => cv.courseId.equals(courseId) && cv.videos.includes(videoId)
    );
    if (alreadyCompleted) {
      return res.json({ message: "Video already marked as complete" });
    }

    let courseCompletion = enrolledCourse.completedVideos.find((cv) =>
      cv.courseId.equals(courseId)
    );
    if (!courseCompletion) {
      courseCompletion = { courseId, videos: [videoId] };
      enrolledCourse.completedVideos.push(courseCompletion);
    } else {
      courseCompletion.videos.push(videoId);
    }
    await student.save();

    const totalVideos = course.section.reduce(
      (acc, section) => acc + section.videos.length,
      0
    );
    const completedVideos = courseCompletion.videos.length;

    res.json({
      message: "Videos marked as complete",
      completedVideos,
      totalVideos,
      allCompleted: completedVideos === totalVideos,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const completedCourses = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const student = await Student.findById(userId).populate(
      "enrolled.coursesAvailable"
    );
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const enrolledCourse = student.enrolled.find((enroll) =>
      enroll.coursesAvailable.equals(courseId)
    );
    if (!enrolledCourse) {
      return res
        .status(404)
        .json({ message: "Course not enrolled by the student" });
    }
    const courseCompletion = enrolledCourse.completedVideos.find((cv) =>
      cv.courseId.equals(courseId)
    ) || { videos: [] };

    const course = await courseModel.findById(courseId);
    const totalVideos = course.sections.reduce(
      (acc, section) => acc + section.videos.length,
      0
    );
    res.json({
      completedVideos: courseCompletion.videos,
      totalVideos,
      allCompleted: courseCompletion.videos.length === totalVideos,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
const progressController = async (req, res) => {
  try {
    const userId = req.user.id;
    const student = await Student.findById(userId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const totalCourses = student.enrolled.length;
    const completedCourses = student.enrolled.filter(
      (course) => course.isComplete
    ).length;
    const coursesPercentage = (completedCourses / totalCourses) * 100;

    const coursesData = {
      totalCourses,
      completedCourses,
      coursesPercentage,
    };

    res.status(200).json({ message: "Progress report", Progress: coursesData });
  } catch (error) {
    res.json({ message: error.message });
  }
};
const courseProgress = async (req, res) => {
  try {
    const studentId = req.user.id;
    const student = await Student.findById(studentId).populate("enrolled");
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    const results = await Promise.all(
      student.enrolled.map(async (course) => {
        const result = await courseModel.aggregate([
          { $match: { _id: course.coursesAvailable } },
          { $unwind: "$section" },
          { $unwind: "$section.videos" },
          {
            $group: {
              _id: null,
              totalVideos: { $sum: 1 },
              completedVideos: {
                $sum: { $cond: ["$section.videos.completed", 1, 0] },
              },
            },
          },
          {
            $project: {
              _id: 0,
              totalVideos: 1,
              completedVideos: 1,
              completedPercentage: {
                $cond: [
                  { $eq: ["$totalVideos", 0] },
                  0,
                  {
                    $multiply: [
                      { $divide: ["$completedVideos", "$totalVideos"] },
                      100,
                    ],
                  },
                ],
              },
            },
          },
        ]);
        return {
          course: course,
          progress: result[0],
        };
      })
    );
    res.json(results);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
//filtering Records
const filter = async (req, res) => {
  try {
    const query = req.query.f;
    console.log(query);
    if (query.toLowerCase() === "paid") {
      const paidCourses = await courseModel.find().where("price").gt(0);
      return res
        .status(200)
        .json({ message: "Paid courses", paidCourses: paidCourses });
    } else if (query.toLowerCase() === "free") {
      const freeCourses = await courseModel.find().where("price").eq(0);
      return res
        .status(200)
        .json({ message: "free courses", freeCourses: freeCourses });
    }
    res.json({ message: "No courses available based on Query" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", Error: error.message });
  }
};
const sorting = async (req, res) => {
  try {
    const query = req.query.sort;
    if (query.toLowerCase() === "asc") {
      const courses = await courseModel.find().sort({ title: 1 });
      return res.json({ message: "Ascending order", course: courses });
    } else if (query.toLowerCase() === "desc") {
      const courses = await courseModel.find().sort({ title: -1 });
      return res.json({ message: "Descending order", course: courses });
    } else if (query.toLowerCase() === "rating") {
      const courses = await courseModel.find().sort({ rating: -1 });
      return res.json({ message: "Rating order", course: courses });
    }
    res.json({ message: "No Sorting chosen" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", Error: error.message });
  }
};
//Rating controller
const ratingController = async (req, res) => {
  const { courseId } = req.params;
  const { rating } = req.query;
  const userId = req.user.id;
  console.log(userId);
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).send("Invalid rating. Must be between 1 and 5");
  }
  try {
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json("Course not found.");
    }

    const existingRating = course.rating.find(
      (r) => r.ratedBy.toString() === userId
    );
    if (existingRating) {
      return res
        .status(400)
        .json({ message: "You have already rated this course" });
    }

    course.rating.push({
      rate: Number(rating),
      ratedBy: userId,
    });
    await course.save();
    res.json({ message: "Thank you for rating the course" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
//Discussions[ ASK QUESTION ]
const askQuestion = async (req, res) => {
  const { videoId, courseId } = req.params;
  const { question } = req.body;
  const askedBy = req.user.id;
  try {
    const course = await courseModel.findById(courseId);
    const discussion = course.discussions;
    discussion.push({
      videoId: videoId,
      courseId: courseId,
      askedBy: askedBy,
      question: question,
    });
    await course.save();
    res.json({
      message:
        "We have got your question, you will get answer back from our instructor",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};
//Discussions List
const topDiscussions = async (req, res) => {
  try {
    const { courseId, videoId } = req.params;
    const course = await courseModel.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }
    const discussions = course.discussions.filter(
      (d) => d.videoId.toString() === videoId
    );
    if (discussions.length === 0) {
      return res
        .status(404)
        .json({ message: "No discussions found for this video" });
    }
    const questionCounts = {};

    discussions.forEach((d) => {
      if (d.question) {
        questionCounts[d.question] = (questionCounts[d.question] || 0) + 1;
      }
    });

    const sortedQuestions = Object.entries(questionCounts)
      .map(([question, count]) => ({
        question,
        count,
        discussions: discussions.filter((d) => d.question === question),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    const data = sortedQuestions.map((q) => {
      const firstDiscussion = q.discussions[0];
      return {
        question: q.question,
        answer: firstDiscussion.answer || "Waiting for answer",
        answeredBy:
          firstDiscussion.answeredBy || "Instructor busy in writing answer",
        createdAt: firstDiscussion.createdAt,
        count: q.count,
      };
    });
    res.json({
      message: `Top ${data.length} discussions on this video`,
      data,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Inernal server error", Error: error.message });
  }

  // try {
  //   const { courseId, videoId } = req.params;
  //   const course = await courseModel.aggregate([
  //     {
  //       $match:{_id:courseId},
  //     },
  //     {$unwind:'$discussions'},
  //     {$match:{  "discussions.videoId": videoId}},
  //     {
  //       $group:{
  //         _id:'$discussions.question',
  //         count:{ $sum:1 },
  //         question:{$first:'$discussions.question'},
  //         answer: { $first: "$discussions.answer" },
  //         answeredBy: { $first: "$discussions.answeredBy" },
  //         createdAt: { $first: "$discussions.createdAt" },
  //       }
  //     },
  //     { $sort :{ count:-1}},
  //     { $limit:10}
  //   ]);
  //   console.log(course)
  //   const data = course.map(item => ({
  //     question: item.question,
  //     answer: item.answer || "Waiting for answer",
  //     answeredBy: item.answeredBy || "Instructor busy in writing answer",
  //     createdAt: item.createdAt,
  //     count: item.count
  //   }));
  //   res.json({
  //     message: `Top ${data.length} discussions on this video`,
  //     data
  //   });
  // } catch (error) {
  //   res.json({ Message: "Internal server error", error: error.message });
  // }
};

module.exports = {
  getProfile,
  enrollCourse,
  showEnrolled,
  topRanks,
  completedCourses,
  progressController,
  courseProgress,
  filter,
  sorting,
  markVideoAsComplete,
  editProfile,
  editPassword,
  ratingController,
  askQuestion,
  topDiscussions,
};

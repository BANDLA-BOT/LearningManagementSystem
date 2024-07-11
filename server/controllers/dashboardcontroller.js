const Student = require("../models/users/studentModel.js");
const courseModel = require("../models/course/courseModel.js");

const getProfile = async (req, res) => {
  const id = req.user;
  console.log(id);
  try {
    const student = await Student.findById({ _id: id.id }).select("-password");
    const courses = await courseModel.find().limit(61

    );
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
    });
    console.log(student);
  } catch (error) {}
};

const enrollCourse = async (req, res) => {
  const { courseId } = req.params;
  const userId = req.user;
  const course = await courseModel.findById({ _id: courseId });
  const student = await Student.findById({ _id: userId.id });
  try {
    if (!student) {
      return res.status(400).json({ message: "Student not found" });
    }
    if (!course) {
      return res.status(400).json({ message: "Course not found" });
    }
    student.enrolled.push({
      coursesAvailable: course._id,
      isComplete: false,
    });
    await student.save();
    res
      .status(200)
      .json({ Message: "Course enrolled successfuly", Student: student });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", Error: error.message });
  }
};

const deleteEnroll = async (req, res) => {
  try {
    const userId = req.user;
    const { courseId } = req.params;
    const result = await Student.updateOne(
      { _id: userId.id },
      { $pull: { enrolled: { _id: courseId } } }
    );
    if (result.nModified > 0) {
      res.status(200).send({ message: "Enrolls Updated" });
    }
    res.json({ EnrollUpdated: result });
  } catch (error) {
    res.status(500).send({ message: "Server error", error });
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
          Count:1
        },
      },
    ]);
    res.status(200).json({ rankings: students });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

const markAsComplete = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user;
    const student = await Student.findOneAndUpdate(
      { _id: userId.id, "enrolled.coursesAvailable": courseId },
      {
        $set: { "enrolled.$.isComplete": true },
        $addToSet: { completedCourses: { courses: courseId } },
      },
      { new: true }
    );
    if (!student) {
      return res.json({ error: "student not found" });
    }
    res.json({ message: student });
  } catch (error) {
    res.json({ message: error.message });
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
                    { $eq: ['$totalVideos', 0] },
                    0,
                    { 
                      $multiply: [
                        { $divide: ['$completedVideos', '$totalVideos'] },
                        100
                      ]
                    }
                  ]
              },
            },
          },
        ]);
        return {
            course:course,
            progress:result[0]
        }
      })
    )
    res.json(results)
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};


//filtering Records 

const filter = async(req,res)=>{
  try {
    const query = req.query.f
    console.log(query)
    if(query.toLowerCase() === 'paid'){
      const paidCourses = await courseModel.find().where('price').gt(0);
      return res.status(200).json({message:"Paid courses", paidCourses:paidCourses})
    }else if(query.toLowerCase() === 'free'){
      const freeCourses = await courseModel.find().where('price').eq(0)
      return res.status(200).json({message:"free courses", freeCourses:freeCourses})
    }
    res.json({message:"No courses available based on Query"})
  } catch (error) {
    res.status(500).json({message:"Internal server error", Error:error.message})
  }
}

const sorting = async(req,res)=>{
  try {
    const query = req.query.sort
    if(query.toLowerCase() === "asc"){
      const courses = await courseModel.find().sort({title:1})
      return res.json({message:"Ascending order", course:courses})
    }
    else if(query.toLowerCase() === "desc"){
      const courses = await courseModel.find().sort({title:-1})
      return res.json({message:"Descending order", course:courses})
    }
    else if(query.toLowerCase() === "rating"){
      const courses = await courseModel.find().sort({rating:-1})
      return res.json({message:"Rating order", course:courses})
    }
    res.json({message:"No Sorting chosen"})
  } catch (error) {
    res.status(500).json({message:"Internal server error", Error:error.message})
  }
}

module.exports = {
  getProfile,
  enrollCourse,
  deleteEnroll,
  topRanks,
  markAsComplete,
  progressController,
  courseProgress,
  //filters and sortings
  filter,
  sorting
};

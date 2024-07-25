const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const router = express.Router();
const fs = require('fs')

//JWT DECODED TOKENS

const adminTokenDecode = require("../../utils/AdminTokenVerify.js");
const verifyToken = require("../../utils/verifyToken.js");
const instructorTokenVerify = require('../../utils/instructorTokenVerify.js')

//Admin imports

const {
  dashboardController,
  searchController,
  createCourse,
  resourceController,
  uploadVideos,
} = require("../../controllers/admin/dashboardController.js");

//Student imports

const {
  getProfile,
  enrollCourse,
  topRanks,
  progressController,
  courseProgress,
  filter,
  sorting,
  markVideoAsComplete,
  completedCourses,
  ratingController,
  topDiscussions,
  askQuestion,
  editProfile,
} = require("../../controllers/student/dashboardcontroller.js");
const { 
  login, 
  resetPasswordLink, 
  resetPassword, 
  register 
} = require("../../controllers/student/authController.js");


//Instructor Imports

const {
  editPassword,
  editInstructorProfile,
  mentorsController,
} = require("../../controllers/instructor/dashboardController.js");
const { 
  registerController,
   loginController
} = require("../../controllers/instructor/authController.js");
const questionsController = require("../../controllers/instructor/questionController.js");
const answerController = require("../../controllers/instructor/answerController.js");





//Multer for videos upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//Cloudinary for videos
cloudinary.config({
  cloud_name: "diqptwlqn",
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});


//Multer to upload resources
const resourceStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "resources");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const uploadResources = multer({
  storage: resourceStorage,
});


//Multer for profile photo for Instructor
if(!fs.existsSync('/uploads')){
  fs.mkdirSync('/uploads')
}
const InstructorProfileStorage = multer.diskStorage({
  destination:(req,file,cb)=>{
      cb(null, '/uploads')
  },
  filename:(req, file, cb)=>{
      cb(null, `${Date.now()}-Instructor-${file.originalname}`)
  }
})
const InstructorUploads = multer({
  storage:InstructorProfileStorage
})

//Multer for update profilePicture of instructor

const updateProfilePic = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null, 'instructorProfilesPics')
  },
  filename:(req,file,cb)=>{
    cb(null,`${Date.now()}-${file.originalname}`)
}
})
const uploadProfilePic = multer({
  storage:updateProfilePic
})



//admin
router.get("/", adminTokenDecode, dashboardController);
router.get("/search", adminTokenDecode, searchController);
router.post("/create/:instructorId", adminTokenDecode, createCourse);
router.post("/uploadvideos/:courseId",upload.single("video"),adminTokenDecode,uploadVideos);
router.post("/resources/:courseId",uploadResources.single("file"),adminTokenDecode,resourceController);


//student Access
router.post('/student/register', upload.single('profile'), adminTokenDecode, register);
router.post('/student/request-reset-password',adminTokenDecode, resetPasswordLink)
router.post('/student/reset-password/:token', adminTokenDecode,resetPassword)
router.post("/student/login", adminTokenDecode, login);
router.get("/student/profile", verifyToken, getProfile);
router.put("/student/editProfile", verifyToken, editProfile);
router.put("/stuednt/editpassword", verifyToken, editPassword);
router.post("/student/enroll/:courseId", verifyToken, enrollCourse);
router.put("/student/markvideoascomplete/:courseId/:videoArrId/:videoId",verifyToken,markVideoAsComplete);
router.get("/student/completedCourses", verifyToken, completedCourses);
router.get("/student/ranking", verifyToken, topRanks);
router.get("/student/progress", verifyToken, progressController);
router.get("/student/courseprogress", verifyToken, courseProgress);
router.get("/student/filter", filter);
router.get("/student/sorting", sorting);
router.post("/student/rate/:courseId/rate", verifyToken, ratingController);
router.post("/student/ask/:courseId/:videoId", verifyToken, askQuestion);
router.get("/student/topDiscuss/:courseId/:videoId",verifyToken,topDiscussions);



//Instructor Access
router.post('/instructor/register', upload.single('profile'), adminTokenDecode, registerController)
router.post('/instructor/login', adminTokenDecode, loginController)
router.put('/instructor/editprofile', uploadProfilePic.single('updatedProfilePic'),instructorTokenVerify, editInstructorProfile)
router.put('/instructor/editpassword', instructorTokenVerify, editPassword)
router.get('/instructor/mentors', instructorTokenVerify, mentorsController)
router.get('/instructor/discussions', instructorTokenVerify, questionsController)
router.post('/instructor/answer/:id/:courseId', instructorTokenVerify, answerController)

module.exports = router;

"use strict";

var express = require("express");

var multer = require("multer");

var router = express.Router();

var fs = require('fs'); //JWT DECODED TOKENS


var adminTokenDecode = require("../../utils/AdminTokenVerify.js");

var verifyToken = require("../../utils/verifyToken.js");

var instructorTokenVerify = require('../../utils/instructorTokenVerify.js'); //Admin imports


var _require = require("../../controllers/admin/dashboardController.js"),
    dashboardController = _require.dashboardController,
    searchController = _require.searchController,
    createCourse = _require.createCourse,
    resourceController = _require.resourceController,
    uploadVideos = _require.uploadVideos,
    acceptCourseRequest = _require.acceptCourseRequest; //Student imports


var _require2 = require("../../controllers/student/dashboardcontroller.js"),
    getProfile = _require2.getProfile,
    enrollCourse = _require2.enrollCourse,
    topRanks = _require2.topRanks,
    progressController = _require2.progressController,
    courseProgress = _require2.courseProgress,
    filter = _require2.filter,
    sorting = _require2.sorting,
    markVideoAsComplete = _require2.markVideoAsComplete,
    completedCourses = _require2.completedCourses,
    ratingController = _require2.ratingController,
    topDiscussions = _require2.topDiscussions,
    askQuestion = _require2.askQuestion,
    editProfile = _require2.editProfile;

var _require3 = require("../../controllers/student/authController.js"),
    login = _require3.login,
    resetPasswordLink = _require3.resetPasswordLink,
    resetPassword = _require3.resetPassword,
    register = _require3.register; //Instructor Imports


var _require4 = require("../../controllers/instructor/dashboardController.js"),
    editPassword = _require4.editPassword,
    editInstructorProfile = _require4.editInstructorProfile,
    mentorsController = _require4.mentorsController;

var _require5 = require("../../controllers/instructor/authController.js"),
    registerController = _require5.registerController,
    loginController = _require5.loginController;

var questionsController = require("../../controllers/instructor/questionController.js");

var answerController = require("../../controllers/instructor/answerController.js"); //Multer for videos upload


var storage = multer.memoryStorage();
var upload = multer({
  storage: storage
}); //Multer to upload resources

var resourceStorage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, "resources");
  },
  filename: function filename(req, file, cb) {
    cb(null, "".concat(Date.now(), "-").concat(file.originalname));
  }
});
var uploadResources = multer({
  storage: resourceStorage
}); //Multer for profile photo for Instructor

if (!fs.existsSync('/uploads')) {
  fs.mkdirSync('/uploads');
}

var InstructorProfileStorage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, '/uploads');
  },
  filename: function filename(req, file, cb) {
    cb(null, "".concat(Date.now(), "-Instructor-").concat(file.originalname));
  }
});
var InstructorUploads = multer({
  storage: InstructorProfileStorage
}); //Multer for update profilePicture of instructor

var updateProfilePic = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, 'instructorProfilesPics');
  },
  filename: function filename(req, file, cb) {
    cb(null, "".concat(Date.now(), "-").concat(file.originalname));
  }
});
var uploadProfilePic = multer({
  storage: updateProfilePic
}); //admin

router.get("/", adminTokenDecode, dashboardController);
router.get("/search", adminTokenDecode, searchController);
router.post("/create/:instructorId", adminTokenDecode, createCourse);
router.post("/uploadvideos/:courseId", upload.single("video"), adminTokenDecode, uploadVideos);
router.post("/resources/:courseId", uploadResources.single("file"), adminTokenDecode, resourceController);
router.put('/acceptcourserequest/:requestId', adminTokenDecode, acceptCourseRequest); //student Access

router.post('/student/register', upload.single('profile'), adminTokenDecode, register);
router.post('/student/request-reset-password', adminTokenDecode, resetPasswordLink);
router.post('/student/reset-password/:token', adminTokenDecode, resetPassword);
router.post("/student/login", adminTokenDecode, login);
router.get("/student/profile", verifyToken, getProfile);
router.put("/student/editProfile", verifyToken, editProfile);
router.put("/stuednt/editpassword", verifyToken, editPassword);
router.post("/student/enroll/:courseId", verifyToken, enrollCourse);
router.put("/student/markvideoascomplete/:courseId/:videoArrId/:videoId", verifyToken, markVideoAsComplete);
router.get("/student/completedCourses", verifyToken, completedCourses);
router.get("/student/ranking", verifyToken, topRanks);
router.get("/student/progress", verifyToken, progressController);
router.get("/student/courseprogress", verifyToken, courseProgress);
router.get("/student/filter", filter);
router.get("/student/sorting", sorting);
router.post("/student/rate/:courseId/rate", verifyToken, ratingController);
router.post("/student/ask/:courseId/:videoId", verifyToken, askQuestion);
router.get("/student/topDiscuss/:courseId/:videoId", verifyToken, topDiscussions); //Instructor Access

router.post('/instructor/register', InstructorUploads.single('profile'), adminTokenDecode, registerController);
router.post('/instructor/login', adminTokenDecode, loginController);
router.put('/instructor/editprofile', uploadProfilePic.single('updatedProfilePic'), instructorTokenVerify, editInstructorProfile);
router.put('/instructor/editpassword', instructorTokenVerify, editPassword);
router.get('/instructor/mentors', instructorTokenVerify, mentorsController);
router.get('/instructor/discussions', instructorTokenVerify, questionsController);
router.post('/instructor/answer/:id/:courseId', instructorTokenVerify, answerController);
module.exports = router;
//# sourceMappingURL=dashboard.dev.js.map

const express = require("express");
const verifyToken = require("../../utils/verifyToken.js");
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
  editProfile,
  editPassword,
  showEnrolled
} = require('../../controllers/student/dashboardcontroller.js');
const router = express.Router();

//dashboard
router.get("/profile", verifyToken, getProfile);
router.put('/editProfile', verifyToken, editProfile)
router.put('/editpassword', verifyToken, editPassword)
router.post("/enroll/:courseId", verifyToken, enrollCourse);
router.get('/showenroll', verifyToken, showEnrolled)

// course completion 
router.post('/markvideoascomplete/:courseId/:videoId', verifyToken, markVideoAsComplete)
router.get('/completedCourses', verifyToken, completedCourses)

//Ranking and progress
router.get("/ranking", verifyToken, topRanks);
router.get("/progress", verifyToken, progressController);
router.get('/courseprogress', verifyToken, courseProgress)

//filter & sorting
router.get('/filter', filter)
router.get('/sorting', sorting)

module.exports = router;

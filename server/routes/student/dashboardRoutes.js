const express = require("express");
const verifyToken = require("../../utils/verifyToken.js");
const {
  getProfile,
  enrollCourse,
  deleteEnroll,
  topRanks,
  markAsComplete,
  progressController,
  courseProgress,
  filter,
  sorting,
  markVideoAsComplete,
  completedCourses,
  editProfile
} = require('../../controllers/student/dashboardcontroller.js');
const router = express.Router();

router.get("/profile", verifyToken, getProfile);
router.put('/editProfile', verifyToken, editProfile)
router.post("/enroll/:courseId", verifyToken, enrollCourse);
router.delete("/deleteEnroll/:courseId", verifyToken, deleteEnroll);
router.put("/markascomplete/:courseId", verifyToken, markAsComplete);
router.put('/markvideoascomplete/:courseId/:videoArrId/:videoId', verifyToken, markVideoAsComplete)
router.get('/completedCourses', verifyToken, completedCourses)
router.get("/ranking", verifyToken, topRanks);
router.get("/progress", verifyToken, progressController);
router.get('/courseprogress', verifyToken, courseProgress)
router.get('/filter', filter)
router.get('/sorting', sorting)

module.exports = router;

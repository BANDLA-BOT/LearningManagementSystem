const express = require("express");
const verifyToken = require("../utils/verifyToken.js");
const {
  getProfile,
  enrollCourse,
  deleteEnroll,

  topRanks,
  markAsComplete,
  progressController,
  courseProgress,
} = require("../controllers/dashboardController.js");
const router = express.Router();

router.get("/profile", verifyToken, getProfile);
router.post("/enroll/:courseId", verifyToken, enrollCourse);
router.delete("/deleteEnroll/:courseId", verifyToken, deleteEnroll);
router.put("/markascomplete/:courseId", verifyToken, markAsComplete);
router.get("/ranking", verifyToken, topRanks);
router.get("/progress", verifyToken, progressController);
router.get('/courseprogress', verifyToken, courseProgress)

module.exports = router;

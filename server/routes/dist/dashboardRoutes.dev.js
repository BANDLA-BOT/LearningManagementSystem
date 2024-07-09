"use strict";

var express = require("express");

var verifyToken = require("../utils/verifyToken.js");

var _require = require("../controllers/dashboardController.js"),
    getProfile = _require.getProfile,
    enrollCourse = _require.enrollCourse,
    deleteEnroll = _require.deleteEnroll,
    topRanks = _require.topRanks,
    markAsComplete = _require.markAsComplete,
    progressController = _require.progressController,
    courseProgress = _require.courseProgress;

var router = express.Router();
router.get("/profile", verifyToken, getProfile);
router.post("/enroll/:courseId", verifyToken, enrollCourse);
router["delete"]("/deleteEnroll/:courseId", verifyToken, deleteEnroll);
router.put("/markascomplete/:courseId", verifyToken, markAsComplete);
router.get("/ranking", verifyToken, topRanks);
router.get("/progress", verifyToken, progressController);
router.get('/courseprogress', verifyToken, courseProgress);
module.exports = router;
//# sourceMappingURL=dashboardRoutes.dev.js.map

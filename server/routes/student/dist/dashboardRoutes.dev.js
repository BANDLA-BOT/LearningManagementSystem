"use strict";

var express = require("express");

var verifyToken = require("../../utils/verifyToken.js");

var _require = require('../../controllers/student/dashboardcontroller.js'),
    getProfile = _require.getProfile,
    enrollCourse = _require.enrollCourse,
    topRanks = _require.topRanks,
    markAsComplete = _require.markAsComplete,
    progressController = _require.progressController,
    courseProgress = _require.courseProgress,
    filter = _require.filter,
    sorting = _require.sorting,
    markVideoAsComplete = _require.markVideoAsComplete,
    completedCourses = _require.completedCourses,
    editProfile = _require.editProfile,
    editPassword = _require.editPassword;

var router = express.Router();
router.get("/profile", verifyToken, getProfile);
router.put('/editProfile', verifyToken, editProfile);
router.put('/editpassword', verifyToken, editPassword);
router.post("/enroll/:courseId", verifyToken, enrollCourse);
router.put("/markascomplete/:courseId", verifyToken, markAsComplete);
router.put('/markvideoascomplete/:courseId/:videoArrId/:videoId', verifyToken, markVideoAsComplete);
router.get('/completedCourses', verifyToken, completedCourses);
router.get("/ranking", verifyToken, topRanks);
router.get("/progress", verifyToken, progressController);
router.get('/courseprogress', verifyToken, courseProgress);
router.get('/filter', filter);
router.get('/sorting', sorting);
module.exports = router;
//# sourceMappingURL=dashboardRoutes.dev.js.map

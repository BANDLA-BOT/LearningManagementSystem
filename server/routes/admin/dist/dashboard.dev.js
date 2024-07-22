"use strict";

var express = require('express');

var adminTokenDecode = require('../../utils/AdminTokenVerify.js');

var verifyToken = require('../../utils/verifyToken.js');

var _require = require('../../controllers/admin/dashboardController.js'),
    dashboardController = _require.dashboardController,
    searchController = _require.searchController;

var _require2 = require('../../controllers/student/dashboardcontroller.js'),
    getProfile = _require2.getProfile,
    enrollCourse = _require2.enrollCourse,
    topRanks = _require2.topRanks,
    progressController = _require2.progressController,
    courseProgress = _require2.courseProgress,
    filter = _require2.filter,
    sorting = _require2.sorting,
    markVideoAsComplete = _require2.markVideoAsComplete,
    completedCourses = _require2.completedCourses;

var _require3 = require('../../controllers/student/authController.js'),
    login = _require3.login;

var router = express.Router();
router.get('/', adminTokenDecode, dashboardController);
router.get('/search', adminTokenDecode, searchController); //student Access

router.post('/student/login', adminTokenDecode, login);
router.get("/student/profile", verifyToken, getProfile);
router.post("/student/enroll/:courseId", verifyToken, enrollCourse);
router.put('/student/markvideoascomplete/:courseId/:videoArrId/:videoId', verifyToken, markVideoAsComplete);
router.get('/student/completedCourses', verifyToken, completedCourses);
router.get("/student/ranking", verifyToken, topRanks);
router.get("/student/progress", verifyToken, progressController);
router.get('/student/courseprogress', verifyToken, courseProgress);
router.get('/student/filter', filter);
router.get('/student/sorting', sorting);
module.exports = router;
//# sourceMappingURL=dashboard.dev.js.map

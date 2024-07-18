"use strict";

var express = require('express');

var adminTokenDecode = require('../../utils/AdminTokenVerify.js');

var verifyToken = require('../../utils/verifyToken.js');

var _require = require('../../controllers/admin/dashboardController.js'),
    dashboardController = _require.dashboardController,
    searchController = _require.searchController;

var _require2 = require('../../controllers/student/dashboardcontroller.js'),
    getProfile = _require2.getProfile;

var _require3 = require('../../controllers/student/authController.js'),
    login = _require3.login;

var router = express.Router();
router.get('/', adminTokenDecode, dashboardController);
router.get('/search', adminTokenDecode, searchController); //student Access

router.post('/student/login', adminTokenDecode, login);
router.get("/student/profile", verifyToken, getProfile); // router.post("/enroll/:courseId", verifyToken, enrollCourse);
// router.delete("/deleteEnroll/:courseId", verifyToken, deleteEnroll);
// router.put("/markascomplete/:courseId", verifyToken, markAsComplete);
// router.put('/markvideoascomplete/:courseId/:videoArrId/:videoId', verifyToken, markVideoAsComplete)
// router.get('/completedCourses', verifyToken, completedCourses)
// router.get("/ranking", verifyToken, topRanks);
// router.get("/progress", verifyToken, progressController);
// router.get('/courseprogress', verifyToken, courseProgress)
// router.get('/filter', filter)
// router.get('/sorting', sorting)
// router.
// router.post('/')

module.exports = router;
//# sourceMappingURL=dashboard.dev.js.map

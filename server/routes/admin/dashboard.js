const express = require('express');
const adminTokenDecode = require('../../utils/AdminTokenVerify.js');
const verifyToken = require('../../utils/verifyToken.js')
const {dashboardController, searchController} = require('../../controllers/admin/dashboardController.js');
const {
    getProfile,
    enrollCourse,
    topRanks,
    progressController,
    courseProgress,
    filter,
    sorting,
    markVideoAsComplete,
    completedCourses
  } = require('../../controllers/student/dashboardcontroller.js');
const { login } = require('../../controllers/student/authController.js')

const router = express.Router();
router.get('/', adminTokenDecode, dashboardController)
router.get('/search', adminTokenDecode, searchController)

//student Access
router.post('/student/login', adminTokenDecode, login);
router.get("/student/profile", verifyToken, getProfile);
router.post("/student/enroll/:courseId", verifyToken, enrollCourse);
router.put('/student/markvideoascomplete/:courseId/:videoArrId/:videoId', verifyToken, markVideoAsComplete)
router.get('/student/completedCourses', verifyToken, completedCourses)
router.get("/student/ranking", verifyToken, topRanks);
router.get("/student/progress", verifyToken, progressController);
router.get('/student/courseprogress', verifyToken, courseProgress)
router.get('/student/filter', filter)
router.get('/student/sorting', sorting)

module.exports = router
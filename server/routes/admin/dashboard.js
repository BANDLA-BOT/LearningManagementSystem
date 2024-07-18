const express = require('express');
const adminTokenDecode = require('../../utils/AdminTokenVerify.js');
const verifyToken = require('../../utils/verifyToken.js')
const {dashboardController, searchController} = require('../../controllers/admin/dashboardController.js');
const {
    getProfile,
    // enrollCourse,
    // deleteEnroll,
    // topRanks,
    // markAsComplete,
    // progressController,
    // courseProgress,
    // filter,
    // sorting,
    // markVideoAsComplete,
    // completedCourses
  } = require('../../controllers/student/dashboardcontroller.js');
const { login } = require('../../controllers/student/authController.js')

const router = express.Router();
router.get('/', adminTokenDecode, dashboardController)
router.get('/search', adminTokenDecode, searchController)

//student Access
router.post('/student/login', adminTokenDecode, login);
router.get("/student/profile", verifyToken, getProfile);
// router.post("/enroll/:courseId", verifyToken, enrollCourse);
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
module.exports = router
"use strict";

var express = require('express');

var verifyToken = require('../utils/verifyToken.js');

var _require = require('../controllers/dashboardController.js'),
    getProfile = _require.getProfile,
    enrollCourse = _require.enrollCourse,
    deleteEnroll = _require.deleteEnroll,
    completedCourses = _require.completedCourses,
    topRanks = _require.topRanks,
    markAsComplete = _require.markAsComplete;

var router = express.Router();
router.get('/profile', verifyToken, getProfile);
router.post('/enroll/:courseId', verifyToken, enrollCourse);
router["delete"]('/deleteEnroll/:courseId', verifyToken, deleteEnroll);
router.put('/completedCourses', verifyToken, completedCourses);
router.get('/ranking', verifyToken, topRanks);
router.put('/markascomplete/:courseId', verifyToken, markAsComplete);
module.exports = router;
//# sourceMappingURL=dashboardRoutes.dev.js.map

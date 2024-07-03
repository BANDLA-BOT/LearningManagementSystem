"use strict";

var express = require('express');

var verifyToken = require('../utils/verifyToken.js');

var _require = require('../controllers/dashboardController.js'),
    getProfile = _require.getProfile,
    enrollCourse = _require.enrollCourse;

var router = express.Router();
router.get('/profile', verifyToken, getProfile);
router.post('/enroll/:courseId', verifyToken, enrollCourse);
module.exports = router;
//# sourceMappingURL=dashboardRoutes.dev.js.map

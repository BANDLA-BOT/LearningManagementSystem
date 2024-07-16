"use strict";

var express = require('express');

var _require = require('../../controllers/student/CreateCourseController.js'),
    createCourse = _require.createCourse;

var router = express.Router();
router.post('/create', createCourse);
module.exports = router;
//# sourceMappingURL=createCourse.dev.js.map

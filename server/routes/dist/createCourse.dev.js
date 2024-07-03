"use strict";

var express = require('express');

var courseCreate = require('../controllers/CreateCourseController.js');

var router = express.Router();
router.post('/create', courseCreate);
module.exports = router;
//# sourceMappingURL=createCourse.dev.js.map

"use strict";

var express = require('express');

var router = express.Router();

var answerController = require('../../controllers/instructor/answerController.js');

var TokenVerified = require('../../utils/instructorTokenVerify.js');

router.post('/answer/:id/:courseId', TokenVerified, answerController);
module.exports = router;
//# sourceMappingURL=discussions.dev.js.map

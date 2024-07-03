"use strict";

var express = require('express');

var addReview = require('../controllers/reviewController.js');

var verifyToken = require('../utils/verifyToken.js');

var router = express.Router();
router.put('/:courseId', verifyToken, addReview);
module.exports = router;
//# sourceMappingURL=reviewRoute.dev.js.map

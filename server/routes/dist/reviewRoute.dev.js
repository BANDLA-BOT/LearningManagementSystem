"use strict";

var express = require('express');

var _require = require('../controllers/student/reviewController.js'),
    reviewController = _require.reviewController,
    deleteReview = _require.deleteReview;

var verifyToken = require('../utils/verifyToken.js');

var router = express.Router();
router.put('/:courseId', verifyToken, reviewController);
router["delete"]('/:courseId/:reviewId', verifyToken, deleteReview);
module.exports = router;
//# sourceMappingURL=reviewRoute.dev.js.map

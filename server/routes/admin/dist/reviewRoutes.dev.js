"use strict";

var express = require('express');

var AdminTokenVerify = require('../../utils/AdminTokenVerify.js');

var _require = require('../../controllers/admin/reviewController.js'),
    deleteReview = _require.deleteReview;

var router = express.Router();
router["delete"]('/delete/:courseId/:reviewId', AdminTokenVerify, deleteReview);
module.exports = router;
//# sourceMappingURL=reviewRoutes.dev.js.map

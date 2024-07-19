const express = require('express');
const {reviewController} = require('../../controllers/student/reviewController.js')
const verifyToken = require('../../utils/verifyToken.js')
const router = express.Router();

router.put('/:courseId', verifyToken, reviewController)
module.exports = router
const express = require('express');
const {reviewController, deleteReview} = require('../controllers/reviewController.js')
const verifyToken = require('../utils/verifyToken.js')
const router = express.Router();

router.put('/:courseId', verifyToken, reviewController)
router.delete('/:courseId/:reviewId', verifyToken, deleteReview)
module.exports = router
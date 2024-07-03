const express = require('express');
const addReview = require('../controllers/reviewController.js')
const verifyToken = require('../utils/verifyToken.js')
const router = express.Router();

router.put('/:courseId', verifyToken, addReview)
module.exports = router
const express = require('express');
const AdminTokenVerify = require('../../utils/AdminTokenVerify.js');
const { deleteReview } = require('../../controllers/admin/reviewController.js');
const router = express.Router()

router.delete('/delete/:courseId/:reviewId',AdminTokenVerify, deleteReview)

module.exports = router
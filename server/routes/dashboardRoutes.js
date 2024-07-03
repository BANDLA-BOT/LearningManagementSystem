const express = require('express');
const verifyToken = require('../utils/verifyToken.js')
const {getProfile, enrollCourse} = require('../controllers/dashboardController.js')
const router = express.Router()

router.get('/profile', verifyToken, getProfile)
router.post('/enroll/:courseId', verifyToken, enrollCourse)

module.exports = router


const express = require('express');
const verifyToken = require('../utils/verifyToken.js')
const {getProfile, enrollCourse, deleteEnroll, completedCourses, topRanks, markAsComplete} = require('../controllers/dashboardController.js')
const router = express.Router()

router.get('/profile', verifyToken, getProfile)
router.post('/enroll/:courseId', verifyToken, enrollCourse)
router.delete('/deleteEnroll/:courseId', verifyToken, deleteEnroll)
router.put('/completedCourses', verifyToken, completedCourses)
router.get('/ranking', verifyToken, topRanks)
router.put('/markascomplete/:courseId', verifyToken, markAsComplete)


module.exports = router


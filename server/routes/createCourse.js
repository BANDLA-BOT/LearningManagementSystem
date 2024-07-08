const express = require('express');
const {createCourse} = require('../controllers/CreateCourseController.js')
const router = express.Router()
router.post('/create', createCourse)
module.exports = router
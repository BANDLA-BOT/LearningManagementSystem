const express = require('express');
const courseCreate = require('../controllers/CreateCourseController.js')
const router = express.Router()

router.post('/create', courseCreate)

module.exports = router
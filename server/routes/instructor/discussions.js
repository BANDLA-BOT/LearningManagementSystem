const express = require('express')
const router = express.Router()
const answerController = require('../../controllers/instructor/answerController.js')
const TokenVerified = require('../../utils/instructorTokenVerify.js')

router.post('/answer/:id/:courseId', TokenVerified, answerController)

module.exports = router
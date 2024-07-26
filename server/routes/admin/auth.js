const express = require('express');
const { register, login, sendOTP, verifyAndUpdate } = require('../../controllers/admin/adminAuthController.js')
const router = express.Router();
router.post('/register', register)
router.post('/login', login)
router.post('/forgot-password', sendOTP)
router.post('/forgot-password-reset', verifyAndUpdate)
module.exports = router
const express = require('express');
const multer = require('multer')
const { register, login, sendOtp, verifyOTP, resetPassword, resetPasswordLink } = require('../../controllers/student/authController.js')
const router = express.Router()
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, 'uploads')
    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}-${file.originalname}`)
    }
})
const upload = multer({
    storage:storage
})
router.post('/register', upload.single('profile'), register);
router.post('/login', login);
router.post('/request-reset-password',resetPasswordLink)
router.post('/reset-password/:token', resetPassword)


module.exports = router 
const express = require('express');
const multer = require('multer')
const { register, login, forgotPassword, sendOtp, verifyOTP } = require('../../controllers/student/authController.js')
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
router.put('/sendotp', sendOtp)
router.post('/verifyotp', verifyOTP)
router.put('/forgotpassword',forgotPassword)


module.exports = router 
const express = require('express');
const router = express.Router()
const path = require('path')
const multer = require('multer')
const fs = require('fs')
const { registerController, loginController, instructorPasswordResetLink, instructorResetPassword} = require('../../controllers/instructor/authController.js')


if(!fs.existsSync('/uploads')){
    fs.mkdirSync('/uploads')
}
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, '/uploads')
    },
    filename:(req, file, cb)=>{
        cb(null, `${Date.now()}-Instructor-${file.originalname}`)
    }
})
const upload = multer({
    storage:storage
})



router.post('/register', upload.single('profilePic'),registerController)
router.post('/login', loginController)

router.post('/reset-password-link', instructorPasswordResetLink)
router.post('/reset-password/:token', instructorResetPassword)
module.exports= router
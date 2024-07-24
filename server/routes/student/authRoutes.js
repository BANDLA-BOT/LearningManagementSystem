const express = require('express');
const multer = require('multer')
const fs = require('fs')
const { register, login, resetPassword, resetPasswordLink } = require('../../controllers/student/authController.js')
const router = express.Router()

if(!fs.existsSync('/uploads')){
    fs.mkdirSync('/uploads')
}
const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null, '/uploads')
    },
    filename:(req,file,cb)=>{
        cb(null,`${Date.now()}-student-${file.originalname}`)
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
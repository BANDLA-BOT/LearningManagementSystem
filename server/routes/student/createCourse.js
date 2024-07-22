const express = require('express');
const {createCourse, uploadVideos} = require('../../controllers/student/CreateCourseController.js');
const multer = require('multer');
const cloudinary = require('cloudinary').v2
const router = express.Router()

//Multer
const storage = multer.memoryStorage()
const upload = multer({storage:storage})

//Cloudinary

cloudinary.config({
    cloud_name:'diqptwlqn',
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET
})

router.post('/create', createCourse)
router.post('/uploadvideos/:courseId',upload.single('video'), uploadVideos)
module.exports = router
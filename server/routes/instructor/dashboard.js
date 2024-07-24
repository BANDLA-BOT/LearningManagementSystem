const express = require('express');
const {createCourse, uploadVideos, resourceController} = require('../../controllers/instructor/CreateCourseController.js');
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

//Multer to upload resources

const resourceStorage = multer.diskStorage({
    destination:(req,file,cb)=>{
      cb(null, 'resources')
    },
    filename:(req,file,cb)=>{
      cb(null,`${Date.now()}-${file.originalname}`)
  }
  })
  const uploadResources = multer({
    storage:resourceStorage
  })
router.post('/create', createCourse)
router.post('/uploadvideos/:courseId',upload.single('video'), uploadVideos)
router.post('/resources/:courseId', upload.single('file'),resourceController)
module.exports = router
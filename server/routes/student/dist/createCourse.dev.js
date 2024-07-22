"use strict";

var express = require('express');

var _require = require('../../controllers/student/CreateCourseController.js'),
    createCourse = _require.createCourse,
    uploadVideos = _require.uploadVideos;

var multer = require('multer');

var cloudinary = require('cloudinary').v2;

var router = express.Router(); //Multer

var storage = multer.memoryStorage();
var upload = multer({
  storage: storage
}); //Cloudinary

cloudinary.config({
  cloud_name: 'diqptwlqn',
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});
router.post('/create', createCourse);
router.post('/uploadvideos/:courseId', upload.single('video'), uploadVideos);
module.exports = router;
//# sourceMappingURL=createCourse.dev.js.map

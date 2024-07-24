"use strict";

var express = require('express');

var _require = require('../../controllers/instructor/CreateCourseController.js'),
    createCourse = _require.createCourse,
    uploadVideos = _require.uploadVideos,
    resourceController = _require.resourceController;

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
}); //Multer to upload resources

var resourceStorage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, 'resources');
  },
  filename: function filename(req, file, cb) {
    cb(null, "".concat(Date.now(), "-").concat(file.originalname));
  }
});
var uploadResources = multer({
  storage: resourceStorage
});
router.post('/create', createCourse);
router.post('/uploadvideos/:courseId', upload.single('video'), uploadVideos);
router.post('/resources/:courseId', upload.single('file'), resourceController);
module.exports = router;
//# sourceMappingURL=dashboard.dev.js.map

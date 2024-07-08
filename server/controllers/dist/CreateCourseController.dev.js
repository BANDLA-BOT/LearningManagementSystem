"use strict";

var CourseModel = require('../models/course/courseModel.js');

var multer = require('multer');

var path = require('path'); //multer 


var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, 'videos/');
  },
  filename: function filename(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({
  storage: storage
});
exports.upload = upload.fields([{
  name: 'videosFile',
  maxCount: 1
}, {
  name: "thumbnail",
  maxCount: 1
}]);

var createCourse = function createCourse(req, res) {
  var _req$body, title, price, rating, reviews, resources, description, instructor, _section, newCourse;

  return regeneratorRuntime.async(function createCourse$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, title = _req$body.title, price = _req$body.price, rating = _req$body.rating, reviews = _req$body.reviews, resources = _req$body.resources, description = _req$body.description, instructor = _req$body.instructor, _section = _req$body.section;
          newCourse = new CourseModel({
            title: title,
            price: price,
            rating: rating,
            reviews: reviews,
            description: description,
            instructor: instructor,
            resources: resources,
            section: _section
          });
          _context.next = 5;
          return regeneratorRuntime.awrap(newCourse.save());

        case 5:
          res.json({
            message: "Course created successfully",
            Course: newCourse
          });
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: "Internal server error",
            Error: _context.t0.message
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var addVideos = function addVideos(req, res) {
  var videos, thumbnail, sections, uploadVideos;
  return regeneratorRuntime.async(function addVideos$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          try {
            videos = req.files['videoFile'] || [];
            thumbnail = req.files['thumbnail'] || [];
            sections = JSON.parse(section);
            uploadVideos = sections.map(function (sec, index) {
              var secVideos = video.filter(function (vid) {
                return vid.filename === "section[".concat(index, "].video");
              }).map(function (video, videoIndex) {
                return {
                  title: video.originalname,
                  thumbnail: thumbnail[videoIndex] ? "/videos/".concat(thumbnail[videoIndex].filename) : '',
                  videoFile: "/videos/".concat(video.filename)
                };
              });
            });
          } catch (error) {}

        case 1:
        case "end":
          return _context2.stop();
      }
    }
  });
};

module.exports = {
  createCourse: createCourse,
  addVideos: addVideos
};
//# sourceMappingURL=CreateCourseController.dev.js.map

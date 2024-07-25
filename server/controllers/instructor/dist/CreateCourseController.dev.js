"use strict";

var CourseModel = require('../../models/course/courseModel.js');

var multer = require('multer');

var cloudinary = require('cloudinary').v2;

var path = require('path');

var createCourse = function createCourse(req, res) {
  var _req$body, title, price, description, newCourse;

  return regeneratorRuntime.async(function createCourse$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, title = _req$body.title, price = _req$body.price, description = _req$body.description;
          _context.next = 4;
          return regeneratorRuntime.awrap(CourseModel.create({
            title: title,
            price: price,
            description: description
          }));

        case 4:
          newCourse = _context.sent;
          res.json(newCourse);
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          res.json(_context.t0.message);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

var uploadVideos = function uploadVideos(req, res) {
  var courseId, _req$body2, title, videoTitle, course, section, result;

  return regeneratorRuntime.async(function uploadVideos$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          courseId = req.params.courseId;
          _req$body2 = req.body, title = _req$body2.title, videoTitle = _req$body2.videoTitle;
          _context3.next = 5;
          return regeneratorRuntime.awrap(CourseModel.findById(courseId));

        case 5:
          course = _context3.sent;
          section = course.section;

          if (!(!req.file && !req.file.buffer)) {
            _context3.next = 9;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            error: 'No file provided in the request'
          }));

        case 9:
          result = cloudinary.uploader.upload_stream({
            resource_type: 'video'
          }, function _callee(err, result) {
            return regeneratorRuntime.async(function _callee$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (!err) {
                      _context2.next = 3;
                      break;
                    }

                    console.error('Error uploading to Cloudinary:', err);
                    return _context2.abrupt("return", res.status(500).json({
                      error: 'Error uploading to Cloudinary'
                    }));

                  case 3:
                    section.push({
                      title: title,
                      videos: [{
                        title: videoTitle,
                        url: result.secure_url
                      }]
                    });
                    _context2.next = 6;
                    return regeneratorRuntime.awrap(course.save());

                  case 6:
                    res.status(201).json({
                      message: 'Video uploaded successfully',
                      section: course.section
                    });

                  case 7:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          }).end(req.file.buffer);
          _context3.next = 16;
          break;

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](0);
          console.error('Error uploading video:', _context3.t0);
          res.status(500).json({
            error: 'Error uploading video'
          });

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var resourceController = function resourceController(req, res) {
  var courseId, title, userId, filePath, course;
  return regeneratorRuntime.async(function resourceController$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          courseId = req.params.courseId;
          title = req.body.title;
          userId = req.user;
          filePath = "".concat(req.file.destination, "/").concat(req.file.filename);
          _context4.next = 7;
          return regeneratorRuntime.awrap(CourseModel.findById(courseId).populate('resources'));

        case 7:
          course = _context4.sent;
          course.resources.push({
            title: title,
            url: filePath
          });
          _context4.next = 11;
          return regeneratorRuntime.awrap(course.save());

        case 11:
          res.json(course);
          _context4.next = 17;
          break;

        case 14:
          _context4.prev = 14;
          _context4.t0 = _context4["catch"](0);
          res.json(_context4.t0.message);

        case 17:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

module.exports = {
  createCourse: createCourse,
  uploadVideos: uploadVideos,
  resourceController: resourceController
};
//# sourceMappingURL=CreateCourseController.dev.js.map

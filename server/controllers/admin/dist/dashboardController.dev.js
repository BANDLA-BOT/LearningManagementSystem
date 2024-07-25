"use strict";

var courseModel = require('../../models/course/courseModel.js');

var Instructor = require('../../models/users/instructorModel.js');

var student = require('../../models/users/studentModel.js');

var dashboardController = function dashboardController(req, res) {
  var Students, Courses, _Instructor;

  return regeneratorRuntime.async(function dashboardController$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(student.find());

        case 3:
          Students = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(courseModel.find());

        case 6:
          Courses = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(_Instructor.find());

        case 9:
          _Instructor = _context.sent;

          if (!(!Students || !Courses || !_Instructor)) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: "Error while fetching Data"
          }));

        case 12:
          res.status(200).json({
            message: "Fetched Data",
            courses: Courses,
            students: Students,
            Instructor: _Instructor
          });
          _context.next = 18;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: "Internal server error",
            error: _context.t0.message
          });

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

var searchController = function searchController(req, res) {
  var query, Coursedata, InstructorData, studentsData;
  return regeneratorRuntime.async(function searchController$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          query = req.query.q;
          _context2.next = 4;
          return regeneratorRuntime.awrap(courseModel.find({
            $or: [{
              title: {
                $regex: query,
                $options: "i"
              }
            }]
          }));

        case 4:
          Coursedata = _context2.sent;
          _context2.next = 7;
          return regeneratorRuntime.awrap(Instructor.find({
            $or: [{
              firstname: {
                $regex: query,
                $options: "i"
              }
            }, {
              lastname: {
                $regex: query,
                $options: 'i'
              }
            }, {
              email: {
                $regex: query,
                $options: 'i'
              }
            }]
          }));

        case 7:
          InstructorData = _context2.sent;
          _context2.next = 10;
          return regeneratorRuntime.awrap(student.find({
            $or: [{
              firstname: {
                $regex: query,
                $options: "i"
              }
            }, {
              lastname: {
                $regex: query,
                $options: 'i'
              }
            }, {
              email: {
                $regex: query,
                $options: 'i'
              }
            }]
          }));

        case 10:
          studentsData = _context2.sent;

          if (!(!Coursedata || !studentsData || !InstructorData)) {
            _context2.next = 13;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: "Not found"
          }));

        case 13:
          res.status(200).json({
            message: "Results fetched",
            Students: studentsData,
            courses: Coursedata,
            InstructorData: InstructorData
          });
          _context2.next = 19;
          break;

        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            message: "Internal server error",
            error: _context2.t0.message
          });

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

var createCourse = function createCourse(req, res) {
  var _req$body, title, price, description, instructorId, newCourse;

  return regeneratorRuntime.async(function createCourse$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body = req.body, title = _req$body.title, price = _req$body.price, description = _req$body.description;
          instructorId = req.params.instructorId;
          _context3.next = 5;
          return regeneratorRuntime.awrap(CourseModel.create({
            title: title,
            price: price,
            description: description,
            instructor: instructorId
          }));

        case 5:
          newCourse = _context3.sent;
          res.json(newCourse);
          _context3.next = 12;
          break;

        case 9:
          _context3.prev = 9;
          _context3.t0 = _context3["catch"](0);
          res.json(_context3.t0.message);

        case 12:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 9]]);
};

var uploadVideos = function uploadVideos(req, res) {
  var courseId, _req$body2, title, videoTitle, course, section, result;

  return regeneratorRuntime.async(function uploadVideos$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          courseId = req.params.courseId;
          _req$body2 = req.body, title = _req$body2.title, videoTitle = _req$body2.videoTitle;
          _context5.next = 5;
          return regeneratorRuntime.awrap(CourseModel.findById(courseId));

        case 5:
          course = _context5.sent;
          section = course.section;

          if (!(!req.file && !req.file.buffer)) {
            _context5.next = 9;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            error: 'No file provided in the request'
          }));

        case 9:
          result = cloudinary.uploader.upload_stream({
            resource_type: 'video'
          }, function _callee(err, result) {
            return regeneratorRuntime.async(function _callee$(_context4) {
              while (1) {
                switch (_context4.prev = _context4.next) {
                  case 0:
                    if (!err) {
                      _context4.next = 3;
                      break;
                    }

                    console.error('Error uploading to Cloudinary:', err);
                    return _context4.abrupt("return", res.status(500).json({
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
                    _context4.next = 6;
                    return regeneratorRuntime.awrap(course.save());

                  case 6:
                    res.status(201).json({
                      message: 'Video uploaded successfully',
                      section: course.section
                    });

                  case 7:
                  case "end":
                    return _context4.stop();
                }
              }
            });
          }).end(req.file.buffer);
          _context5.next = 16;
          break;

        case 12:
          _context5.prev = 12;
          _context5.t0 = _context5["catch"](0);
          console.error('Error uploading video:', _context5.t0);
          res.status(500).json({
            error: 'Error uploading video'
          });

        case 16:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var resourceController = function resourceController(req, res) {
  var courseId, title, userId, filePath, course;
  return regeneratorRuntime.async(function resourceController$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          courseId = req.params.courseId;
          title = req.body.title;
          userId = req.user;
          filePath = "".concat(req.file.destination, "/").concat(req.file.filename);
          _context6.next = 7;
          return regeneratorRuntime.awrap(CourseModel.findById(courseId).populate('resources'));

        case 7:
          course = _context6.sent;
          course.resources.push({
            title: title,
            url: filePath
          });
          _context6.next = 11;
          return regeneratorRuntime.awrap(course.save());

        case 11:
          res.json(course);
          _context6.next = 17;
          break;

        case 14:
          _context6.prev = 14;
          _context6.t0 = _context6["catch"](0);
          res.json(_context6.t0.message);

        case 17:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

module.exports = {
  dashboardController: dashboardController,
  searchController: searchController,
  createCourse: createCourse,
  uploadVideos: uploadVideos,
  resourceController: resourceController
};
//# sourceMappingURL=dashboardController.dev.js.map

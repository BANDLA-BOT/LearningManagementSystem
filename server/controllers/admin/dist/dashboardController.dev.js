"use strict";

var courseModel = require('../../models/course/courseModel.js');

var Instructor = require('../../models/users/instructorModel.js');

var student = require('../../models/users/studentModel.js');

var cloudinary = require("cloudinary").v2;

var nodemailer = require('nodemailer');

var multer = require("multer");

var adminModel = require('../../models/users/adminModel.js');

var studentModel = require('../../models/users/studentModel.js'); //Cloudinary for videos


cloudinary.config({
  cloud_name: "diqptwlqn",
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

var dashboardController = function dashboardController(req, res) {
  var Students, Courses, instructor;
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
          return regeneratorRuntime.awrap(Instructor.find());

        case 9:
          instructor = _context.sent;

          if (!(!Students || !Courses || !instructor)) {
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
            Instructor: instructor
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
  var _req$body, title, price, description, instructorId, instructor, newCourse, transporter, mailOptions;

  return regeneratorRuntime.async(function createCourse$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$body = req.body, title = _req$body.title, price = _req$body.price, description = _req$body.description;
          instructorId = req.params.instructorId;
          _context3.next = 5;
          return regeneratorRuntime.awrap(Instructor.findById(instructorId));

        case 5:
          instructor = _context3.sent;
          _context3.next = 8;
          return regeneratorRuntime.awrap(courseModel.create({
            title: title,
            price: price,
            description: description,
            instructor: instructorId
          }));

        case 8:
          newCourse = _context3.sent;
          transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            },
            secure: true
          });
          mailOptions = {
            from: process.env.EMAIL_USER,
            to: instructor.email,
            subject: "Task Added",
            html: "You have assigned to a task\n        <b><p>Coursename:".concat(title, "</p></b>\n        <b><p>Price:").concat(price, "</p></b>\n        <b><p>Description:").concat(description, "</p></b>\n      ")
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return res.json({
                Message: "Error while sending email",
                error: error.message
              });
            }

            res.json({
              Message: "Email sent successfully ",
              Status: "Task assigned succesfully to the ".concat(instructor.email)
            });
          });
          _context3.next = 17;
          break;

        case 14:
          _context3.prev = 14;
          _context3.t0 = _context3["catch"](0);
          res.json(_context3.t0.message);

        case 17:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 14]]);
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
          return regeneratorRuntime.awrap(courseModel.findById(courseId));

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
          return regeneratorRuntime.awrap(courseModel.findById(courseId).populate('resources'));

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

var acceptCourseRequest = function acceptCourseRequest(req, res) {
  var requestId, studentId, Admin, Student, enrolledList, requests, Accept;
  return regeneratorRuntime.async(function acceptCourseRequest$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          requestId = req.params.requestId;
          studentId = req.body.studentId;
          _context7.next = 5;
          return regeneratorRuntime.awrap(adminModel.findOne().populate('courseRequests'));

        case 5:
          Admin = _context7.sent;
          _context7.next = 8;
          return regeneratorRuntime.awrap(student.findById({
            _id: studentId
          }).populate('enrolled'));

        case 8:
          Student = _context7.sent;
          enrolledList = Student.enrolled; // console.log(Student)

          if (Student) {
            _context7.next = 12;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            Message: "No student found with this ID"
          }));

        case 12:
          requests = Admin.courseRequests;
          Accept = requests.id(requestId);

          if (Accept.paid) {
            _context7.next = 16;
            break;
          }

          return _context7.abrupt("return", res.status(400).json({
            Message: "User did not Paid for the course"
          }));

        case 16:
          Accept.accept = true;
          enrolledList.push({
            coursesAvailable: Accept.courseId
          });
          _context7.next = 20;
          return regeneratorRuntime.awrap(Student.save());

        case 20:
          _context7.next = 22;
          return regeneratorRuntime.awrap(Admin.save());

        case 22:
          res.status(200).json({
            Message: "Course confirmed"
          });
          _context7.next = 28;
          break;

        case 25:
          _context7.prev = 25;
          _context7.t0 = _context7["catch"](0);
          res.status(500).json({
            Message: "Internal server error",
            error: _context7.t0.message
          });

        case 28:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 25]]);
};

module.exports = {
  dashboardController: dashboardController,
  searchController: searchController,
  createCourse: createCourse,
  uploadVideos: uploadVideos,
  resourceController: resourceController,
  acceptCourseRequest: acceptCourseRequest
};
//# sourceMappingURL=dashboardController.dev.js.map

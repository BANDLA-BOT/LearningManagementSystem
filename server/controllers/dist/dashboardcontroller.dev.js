"use strict";

var Student = require('../models/users/studentModel.js');

var courseModel = require('../models/course/courseModel.js');

var getProfile = function getProfile(req, res) {
  var id, student, courses;
  return regeneratorRuntime.async(function getProfile$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          id = req.user;
          console.log(id);
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap(Student.findById({
            _id: id.id
          }).select('-password'));

        case 5:
          student = _context.sent;
          _context.next = 8;
          return regeneratorRuntime.awrap(courseModel.find().limit(4));

        case 8:
          courses = _context.sent;

          if (student) {
            _context.next = 11;
            break;
          }

          return _context.abrupt("return", res.json({
            message: "No student found "
          }));

        case 11:
          if (courses) {
            _context.next = 13;
            break;
          }

          return _context.abrupt("return", res.json({
            message: "No courses available currently"
          }));

        case 13:
          res.json({
            message: "Students Profile",
            Profile: student,
            courses: courses
          });
          console.log(student);
          _context.next = 19;
          break;

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](2);

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 17]]);
};

var enrollCourse = function enrollCourse(req, res) {
  var courseId, userId, course, student, user;
  return regeneratorRuntime.async(function enrollCourse$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          courseId = req.params.courseId;
          userId = req.user;
          _context2.next = 4;
          return regeneratorRuntime.awrap(courseModel.findById({
            _id: courseId
          }));

        case 4:
          course = _context2.sent;
          _context2.next = 7;
          return regeneratorRuntime.awrap(Student.findById({
            _id: userId.id
          }));

        case 7:
          student = _context2.sent;
          _context2.prev = 8;

          if (student) {
            _context2.next = 11;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Student not found"
          }));

        case 11:
          if (course) {
            _context2.next = 13;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Course not found"
          }));

        case 13:
          student.enrolled.push(course);
          _context2.next = 16;
          return regeneratorRuntime.awrap(Student.findById({
            _id: userId.id
          }).populate('enrolled'));

        case 16:
          user = _context2.sent;
          _context2.next = 19;
          return regeneratorRuntime.awrap(student.save());

        case 19:
          res.status(200).json({
            Message: "Course enrolled successfuly",
            Student: user
          });
          _context2.next = 25;
          break;

        case 22:
          _context2.prev = 22;
          _context2.t0 = _context2["catch"](8);
          res.status(500).json({
            message: "Internal server error",
            Error: _context2.t0.message
          });

        case 25:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[8, 22]]);
};

module.exports = {
  getProfile: getProfile,
  enrollCourse: enrollCourse
};
//# sourceMappingURL=dashboardcontroller.dev.js.map

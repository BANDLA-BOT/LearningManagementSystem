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
  var courseId, userId, course, student;
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
          student.enrolled.push({
            coursesAvailable: course._id,
            isComplete: false
          });
          _context2.next = 16;
          return regeneratorRuntime.awrap(student.save());

        case 16:
          res.status(200).json({
            Message: "Course enrolled successfuly",
            Student: student
          });
          _context2.next = 22;
          break;

        case 19:
          _context2.prev = 19;
          _context2.t0 = _context2["catch"](8);
          res.status(500).json({
            message: "Internal server error",
            Error: _context2.t0.message
          });

        case 22:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[8, 19]]);
};

var deleteEnroll = function deleteEnroll(req, res) {
  var userId, courseId, result;
  return regeneratorRuntime.async(function deleteEnroll$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = req.user;
          courseId = req.params.courseId;
          _context3.next = 5;
          return regeneratorRuntime.awrap(Student.updateOne({
            _id: userId.id
          }, {
            $pull: {
              enrolled: {
                _id: courseId
              }
            }
          }));

        case 5:
          result = _context3.sent;

          if (result.nModified > 0) {
            res.status(200).send({
              message: "Enrolls Updated"
            });
          }

          res.json({
            EnrollUpdated: result
          });
          _context3.next = 13;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](0);
          res.status(500).send({
            message: 'Server error',
            error: _context3.t0
          });

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var completedCourses = function completedCourses(req, res) {
  var userId, student, _completedCourses;

  return regeneratorRuntime.async(function completedCourses$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          userId = req.user;
          _context4.next = 4;
          return regeneratorRuntime.awrap(Student.findById({
            _id: userId.id
          }));

        case 4:
          student = _context4.sent;

          if (student) {
            _context4.next = 7;
            break;
          }

          return _context4.abrupt("return", res.status(404).send({
            message: 'Student not found'
          }));

        case 7:
          _completedCourses = student.enrolled.filter(function (course) {
            return course.isComplete;
          }).map(function (course) {
            return {
              courses: course.coursesAvailable
            };
          });
          _context4.next = 10;
          return regeneratorRuntime.awrap(Student.updateOne({
            _id: userId.id
          }, {
            $addToSet: {
              completedCourses: {
                $each: _completedCourses
              }
            }
          }));

        case 10:
          res.status(200).json({
            message: 'Completed courses updated successfully'
          });
          _context4.next = 16;
          break;

        case 13:
          _context4.prev = 13;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            message: 'Server error',
            error: _context4.t0
          });

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var topRanks = function topRanks(req, res) {
  var students;
  return regeneratorRuntime.async(function topRanks$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Student.aggregate([{
            $match: {
              'enrolled.isComplete': true
            }
          }, {
            $addFields: {
              Count: {
                $size: {
                  $filter: {
                    input: '$enrolled',
                    as: 'enrolled',
                    cond: {
                      $eq: ['$$enrolled.isComplete', true]
                    }
                  }
                }
              }
            }
          }, {
            $sort: {
              _id: -1
            }
          }, {
            $project: {
              firstname: 1,
              lastname: 1
            }
          }]));

        case 3:
          students = _context5.sent;
          res.status(200).json({
            rankings: students
          });
          _context5.next = 10;
          break;

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          res.status(500).json({
            message: "Internal server error"
          });

        case 10:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var markAsComplete = function markAsComplete(req, res) {
  var courseId, userId, student;
  return regeneratorRuntime.async(function markAsComplete$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          courseId = req.params.courseId;
          userId = req.user;
          _context6.next = 5;
          return regeneratorRuntime.awrap(Student.findOneAndUpdate({
            _id: userId.id,
            'enrolled.coursesAvailable': courseId
          }, {
            $set: {
              'enrolled.$.isComplete': true
            },
            $addToSet: {
              completedCourses: {
                courses: courseId
              }
            }
          }, {
            "new": true
          }));

        case 5:
          student = _context6.sent;

          if (student) {
            _context6.next = 8;
            break;
          }

          return _context6.abrupt("return", res.json({
            error: "student not found"
          }));

        case 8:
          res.json({
            message: student
          });
          _context6.next = 14;
          break;

        case 11:
          _context6.prev = 11;
          _context6.t0 = _context6["catch"](0);
          res.json({
            message: _context6.t0.message
          });

        case 14:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

module.exports = {
  getProfile: getProfile,
  enrollCourse: enrollCourse,
  deleteEnroll: deleteEnroll,
  completedCourses: completedCourses,
  topRanks: topRanks,
  markAsComplete: markAsComplete
};
//# sourceMappingURL=dashboardController.dev.js.map

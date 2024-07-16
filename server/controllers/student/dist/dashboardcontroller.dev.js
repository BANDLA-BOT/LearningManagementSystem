"use strict";

var Student = require('../../models/users/studentModel.js');

var courseModel = require('../../models/course/courseModel.js');

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
          }).select("-password"));

        case 5:
          student = _context.sent;
          _context.next = 8;
          return regeneratorRuntime.awrap(courseModel.find().limit(61));

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
            message: "Server error",
            error: _context3.t0
          });

        case 13:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var topRanks = function topRanks(req, res) {
  var students;
  return regeneratorRuntime.async(function topRanks$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Student.aggregate([{
            $match: {
              "enrolled.isComplete": true
            }
          }, {
            $addFields: {
              Count: {
                $size: {
                  $filter: {
                    input: "$enrolled",
                    as: "enrolled",
                    cond: {
                      $eq: ["$$enrolled.isComplete", true]
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
              lastname: 1,
              Count: 1
            }
          }]));

        case 3:
          students = _context4.sent;
          res.status(200).json({
            rankings: students
          });
          _context4.next = 10;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            message: "Internal server error"
          });

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var markAsComplete = function markAsComplete(req, res) {
  var courseId, userId, student;
  return regeneratorRuntime.async(function markAsComplete$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          courseId = req.params.courseId;
          userId = req.user;
          _context5.next = 5;
          return regeneratorRuntime.awrap(Student.findOneAndUpdate({
            _id: userId.id,
            "enrolled.coursesAvailable": courseId
          }, {
            $set: {
              "enrolled.$.isComplete": true
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
          student = _context5.sent;

          if (student) {
            _context5.next = 8;
            break;
          }

          return _context5.abrupt("return", res.json({
            error: "student not found"
          }));

        case 8:
          res.json({
            message: student
          });
          _context5.next = 14;
          break;

        case 11:
          _context5.prev = 11;
          _context5.t0 = _context5["catch"](0);
          res.json({
            message: _context5.t0.message
          });

        case 14:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

var progressController = function progressController(req, res) {
  var userId, student, totalCourses, completedCourses, coursesPercentage, coursesData;
  return regeneratorRuntime.async(function progressController$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          userId = req.user.id;
          _context6.next = 4;
          return regeneratorRuntime.awrap(Student.findById(userId));

        case 4:
          student = _context6.sent;

          if (student) {
            _context6.next = 7;
            break;
          }

          return _context6.abrupt("return", res.status(404).json({
            message: "Student not found"
          }));

        case 7:
          totalCourses = student.enrolled.length;
          completedCourses = student.enrolled.filter(function (course) {
            return course.isComplete;
          }).length;
          coursesPercentage = completedCourses / totalCourses * 100;
          coursesData = {
            totalCourses: totalCourses,
            completedCourses: completedCourses,
            coursesPercentage: coursesPercentage
          };
          res.status(200).json({
            message: "Progress report",
            Progress: coursesData
          });
          _context6.next = 17;
          break;

        case 14:
          _context6.prev = 14;
          _context6.t0 = _context6["catch"](0);
          res.json({
            message: _context6.t0.message
          });

        case 17:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

var courseProgress = function courseProgress(req, res) {
  var studentId, student, results;
  return regeneratorRuntime.async(function courseProgress$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          studentId = req.user.id;
          _context8.next = 4;
          return regeneratorRuntime.awrap(Student.findById(studentId).populate("enrolled"));

        case 4:
          student = _context8.sent;

          if (student) {
            _context8.next = 7;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            message: "Student not found"
          }));

        case 7:
          _context8.next = 9;
          return regeneratorRuntime.awrap(Promise.all(student.enrolled.map(function _callee(course) {
            var result;
            return regeneratorRuntime.async(function _callee$(_context7) {
              while (1) {
                switch (_context7.prev = _context7.next) {
                  case 0:
                    _context7.next = 2;
                    return regeneratorRuntime.awrap(courseModel.aggregate([{
                      $match: {
                        _id: course.coursesAvailable
                      }
                    }, {
                      $unwind: "$section"
                    }, {
                      $unwind: "$section.videos"
                    }, {
                      $group: {
                        _id: null,
                        totalVideos: {
                          $sum: 1
                        },
                        completedVideos: {
                          $sum: {
                            $cond: ["$section.videos.completed", 1, 0]
                          }
                        }
                      }
                    }, {
                      $project: {
                        _id: 0,
                        totalVideos: 1,
                        completedVideos: 1,
                        completedPercentage: {
                          $cond: [{
                            $eq: ['$totalVideos', 0]
                          }, 0, {
                            $multiply: [{
                              $divide: ['$completedVideos', '$totalVideos']
                            }, 100]
                          }]
                        }
                      }
                    }]));

                  case 2:
                    result = _context7.sent;
                    return _context7.abrupt("return", {
                      course: course,
                      progress: result[0]
                    });

                  case 4:
                  case "end":
                    return _context7.stop();
                }
              }
            });
          })));

        case 9:
          results = _context8.sent;
          res.json(results);
          _context8.next = 16;
          break;

        case 13:
          _context8.prev = 13;
          _context8.t0 = _context8["catch"](0);
          res.status(500).json({
            message: "Internal server error",
            error: _context8.t0.message
          });

        case 16:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 13]]);
}; //filtering Records 


var filter = function filter(req, res) {
  var query, paidCourses, freeCourses;
  return regeneratorRuntime.async(function filter$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          query = req.query.f;
          console.log(query);

          if (!(query.toLowerCase() === 'paid')) {
            _context9.next = 10;
            break;
          }

          _context9.next = 6;
          return regeneratorRuntime.awrap(courseModel.find().where('price').gt(0));

        case 6:
          paidCourses = _context9.sent;
          return _context9.abrupt("return", res.status(200).json({
            message: "Paid courses",
            paidCourses: paidCourses
          }));

        case 10:
          if (!(query.toLowerCase() === 'free')) {
            _context9.next = 15;
            break;
          }

          _context9.next = 13;
          return regeneratorRuntime.awrap(courseModel.find().where('price').eq(0));

        case 13:
          freeCourses = _context9.sent;
          return _context9.abrupt("return", res.status(200).json({
            message: "free courses",
            freeCourses: freeCourses
          }));

        case 15:
          res.json({
            message: "No courses available based on Query"
          });
          _context9.next = 21;
          break;

        case 18:
          _context9.prev = 18;
          _context9.t0 = _context9["catch"](0);
          res.status(500).json({
            message: "Internal server error",
            Error: _context9.t0.message
          });

        case 21:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

var sorting = function sorting(req, res) {
  var query, courses, _courses, _courses2;

  return regeneratorRuntime.async(function sorting$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.prev = 0;
          query = req.query.sort;

          if (!(query.toLowerCase() === "asc")) {
            _context10.next = 9;
            break;
          }

          _context10.next = 5;
          return regeneratorRuntime.awrap(courseModel.find().sort({
            title: 1
          }));

        case 5:
          courses = _context10.sent;
          return _context10.abrupt("return", res.json({
            message: "Ascending order",
            course: courses
          }));

        case 9:
          if (!(query.toLowerCase() === "desc")) {
            _context10.next = 16;
            break;
          }

          _context10.next = 12;
          return regeneratorRuntime.awrap(courseModel.find().sort({
            title: -1
          }));

        case 12:
          _courses = _context10.sent;
          return _context10.abrupt("return", res.json({
            message: "Descending order",
            course: _courses
          }));

        case 16:
          if (!(query.toLowerCase() === "rating")) {
            _context10.next = 21;
            break;
          }

          _context10.next = 19;
          return regeneratorRuntime.awrap(courseModel.find().sort({
            rating: -1
          }));

        case 19:
          _courses2 = _context10.sent;
          return _context10.abrupt("return", res.json({
            message: "Rating order",
            course: _courses2
          }));

        case 21:
          res.json({
            message: "No Sorting chosen"
          });
          _context10.next = 27;
          break;

        case 24:
          _context10.prev = 24;
          _context10.t0 = _context10["catch"](0);
          res.status(500).json({
            message: "Internal server error",
            Error: _context10.t0.message
          });

        case 27:
        case "end":
          return _context10.stop();
      }
    }
  }, null, null, [[0, 24]]);
};

module.exports = {
  getProfile: getProfile,
  enrollCourse: enrollCourse,
  deleteEnroll: deleteEnroll,
  topRanks: topRanks,
  markAsComplete: markAsComplete,
  progressController: progressController,
  courseProgress: courseProgress,
  filter: filter,
  sorting: sorting
};
//# sourceMappingURL=dashboardcontroller.dev.js.map

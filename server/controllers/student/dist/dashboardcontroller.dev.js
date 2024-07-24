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
            courses: courses,
            status: true
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

var editProfile = function editProfile(req, res) {
  var _req$body, email, firstname, lastname, userId, student;

  return regeneratorRuntime.async(function editProfile$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body = req.body, email = _req$body.email, firstname = _req$body.firstname, lastname = _req$body.lastname;
          userId = req.user.id;
          console.log(userId);
          _context2.next = 6;
          return regeneratorRuntime.awrap(Student.updateOne({
            _id: userId
          }, {
            $set: {
              firstname: firstname,
              lastname: lastname,
              email: email
            }
          }));

        case 6:
          student = _context2.sent;
          res.status(200).json({
            message: "Profile updated successfuly"
          });
          _context2.next = 13;
          break;

        case 10:
          _context2.prev = 10;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            message: "Internal server error",
            Error: _context2.t0.message
          });

        case 13:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

var editPassword = function editPassword(req, res) {
  var userId, _req$body2, currentPassword, newPassword, reEnterNewPassword, student;

  return regeneratorRuntime.async(function editPassword$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = req.user.id;
          _req$body2 = req.body, currentPassword = _req$body2.currentPassword, newPassword = _req$body2.newPassword, reEnterNewPassword = _req$body2.reEnterNewPassword;
          _context3.next = 5;
          return regeneratorRuntime.awrap(Student.findById(userId));

        case 5:
          student = _context3.sent;

          if (!(currentPassword !== student.password)) {
            _context3.next = 8;
            break;
          }

          return _context3.abrupt("return", res.json({
            message: "You have entered wrong current password"
          }));

        case 8:
          if (!(newPassword === student.password)) {
            _context3.next = 10;
            break;
          }

          return _context3.abrupt("return", res.json({
            message: "New password should be different from Old password"
          }));

        case 10:
          if (!(newPassword !== reEnterNewPassword)) {
            _context3.next = 12;
            break;
          }

          return _context3.abrupt("return", res.json({
            message: "Confirm password should same as New password"
          }));

        case 12:
          student.password = newPassword;
          _context3.next = 15;
          return regeneratorRuntime.awrap(student.save());

        case 15:
          res.json({
            message: "Password changed successfully"
          });
          _context3.next = 21;
          break;

        case 18:
          _context3.prev = 18;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            message: "Internal server error",
            Error: _context3.t0.message
          });

        case 21:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

var enrollCourse = function enrollCourse(req, res) {
  var courseId, userId, course, student, Course, available;
  return regeneratorRuntime.async(function enrollCourse$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          courseId = req.params.courseId;
          userId = req.user;
          _context4.next = 4;
          return regeneratorRuntime.awrap(courseModel.findById({
            _id: courseId
          }));

        case 4:
          course = _context4.sent;
          _context4.next = 7;
          return regeneratorRuntime.awrap(Student.findById({
            _id: userId.id
          }));

        case 7:
          student = _context4.sent;
          _context4.prev = 8;

          if (student) {
            _context4.next = 11;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            message: "Student not found"
          }));

        case 11:
          if (course) {
            _context4.next = 13;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            message: "Course not found"
          }));

        case 13:
          Course = student.enrolled;
          available = Course.some(function (course) {
            return course.coursesAvailable.equals(courseId);
          });

          if (!available) {
            _context4.next = 17;
            break;
          }

          return _context4.abrupt("return", res.json({
            Message: "You have already enrolled this course"
          }));

        case 17:
          student.enrolled.push({
            coursesAvailable: course._id,
            isComplete: false
          });
          _context4.next = 20;
          return regeneratorRuntime.awrap(student.save());

        case 20:
          res.status(200).json({
            Message: "Course enrolled successfuly",
            Student: student
          });
          _context4.next = 26;
          break;

        case 23:
          _context4.prev = 23;
          _context4.t0 = _context4["catch"](8);
          res.status(500).json({
            message: "Internal server error",
            Error: _context4.t0.message
          });

        case 26:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[8, 23]]);
};

var showEnrolled = function showEnrolled(req, res) {
  var userId, student;
  return regeneratorRuntime.async(function showEnrolled$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          userId = req.user;
          _context5.prev = 1;
          _context5.next = 4;
          return regeneratorRuntime.awrap(Student.findById({
            _id: userId.id
          }).populate('enrolled.coursesAvailable'));

        case 4:
          student = _context5.sent;

          if (student) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: "Student not found"
          }));

        case 7:
          res.status(200).json({
            message: "Found",
            List: student.enrolled
          });
          _context5.next = 13;
          break;

        case 10:
          _context5.prev = 10;
          _context5.t0 = _context5["catch"](1);
          res.status(500).json({
            message: "Internal server error",
            error: _context5.t0.message
          });

        case 13:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 10]]);
};

var topRanks = function topRanks(req, res) {
  var students;
  return regeneratorRuntime.async(function topRanks$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
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
          students = _context6.sent;
          res.status(200).json({
            rankings: students
          });
          _context6.next = 10;
          break;

        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          res.status(500).json({
            message: "Internal server error"
          });

        case 10:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

var markVideoAsComplete = function markVideoAsComplete(req, res) {
  var _req$params, courseId, videoId, userId, course, student, enrolledCourses, enrolledCourse, alreadyCompleted, courseCompletion, totalVideos, completedVideos;

  return regeneratorRuntime.async(function markVideoAsComplete$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.prev = 0;
          _req$params = req.params, courseId = _req$params.courseId, videoId = _req$params.videoId;
          userId = req.user.id;
          _context7.next = 5;
          return regeneratorRuntime.awrap(courseModel.findById(courseId));

        case 5:
          course = _context7.sent;

          if (course) {
            _context7.next = 8;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            message: "Course not found"
          }));

        case 8:
          _context7.next = 10;
          return regeneratorRuntime.awrap(Student.findById(userId).populate('enrolled.coursesAvailable'));

        case 10:
          student = _context7.sent;

          if (student) {
            _context7.next = 13;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            message: "Student not found"
          }));

        case 13:
          enrolledCourses = student.enrolled;
          console.log(enrolledCourses);
          enrolledCourse = student.enrolled.find(function (enroll) {
            return enroll.coursesAvailable.equals(courseId);
          });
          console.log(enrolledCourse);

          if (enrolledCourse) {
            _context7.next = 19;
            break;
          }

          return _context7.abrupt("return", res.status(404).json({
            message: "Course not enrolled by the student"
          }));

        case 19:
          alreadyCompleted = enrolledCourse.completedVideos.find(function (cv) {
            return cv.courseId.equals(courseId) && cv.videos.includes(videoId);
          });

          if (!alreadyCompleted) {
            _context7.next = 22;
            break;
          }

          return _context7.abrupt("return", res.json({
            message: "Video already marked as complete"
          }));

        case 22:
          courseCompletion = enrolledCourse.completedVideos.find(function (cv) {
            return cv.courseId.equals(courseId);
          });

          if (!courseCompletion) {
            courseCompletion = {
              courseId: courseId,
              videos: [videoId]
            };
            enrolledCourse.completedVideos.push(courseCompletion);
          } else {
            courseCompletion.videos.push(videoId);
          }

          _context7.next = 26;
          return regeneratorRuntime.awrap(student.save());

        case 26:
          totalVideos = course.section.reduce(function (acc, section) {
            return acc + section.videos.length;
          }, 0);
          completedVideos = courseCompletion.videos.length;
          res.json({
            message: "Videos marked as complete",
            completedVideos: completedVideos,
            totalVideos: totalVideos,
            allCompleted: completedVideos === totalVideos
          });
          _context7.next = 34;
          break;

        case 31:
          _context7.prev = 31;
          _context7.t0 = _context7["catch"](0);
          res.status(500).json({
            message: "Internal server error",
            error: _context7.t0.message
          });

        case 34:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[0, 31]]);
};

var completedCourses = function completedCourses(req, res) {
  var courseId, userId, student, enrolledCourse, courseCompletion, course, totalVideos;
  return regeneratorRuntime.async(function completedCourses$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.prev = 0;
          courseId = req.params.courseId;
          userId = req.user.id;
          _context8.next = 5;
          return regeneratorRuntime.awrap(Student.findById(userId).populate('enrolled.coursesAvailable'));

        case 5:
          student = _context8.sent;

          if (student) {
            _context8.next = 8;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            message: "Student not found"
          }));

        case 8:
          enrolledCourse = student.enrolled.find(function (enroll) {
            return enroll.coursesAvailable.equals(courseId);
          });

          if (enrolledCourse) {
            _context8.next = 11;
            break;
          }

          return _context8.abrupt("return", res.status(404).json({
            message: "Course not enrolled by the student"
          }));

        case 11:
          courseCompletion = enrolledCourse.completedVideos.find(function (cv) {
            return cv.courseId.equals(courseId);
          }) || {
            videos: []
          };
          _context8.next = 14;
          return regeneratorRuntime.awrap(courseModel.findById(courseId));

        case 14:
          course = _context8.sent;
          totalVideos = course.sections.reduce(function (acc, section) {
            return acc + section.videos.length;
          }, 0);
          res.json({
            completedVideos: courseCompletion.videos,
            totalVideos: totalVideos,
            allCompleted: courseCompletion.videos.length === totalVideos
          });
          _context8.next = 22;
          break;

        case 19:
          _context8.prev = 19;
          _context8.t0 = _context8["catch"](0);
          res.status(500).json({
            message: "Internal server error",
            error: _context8.t0.message
          });

        case 22:
        case "end":
          return _context8.stop();
      }
    }
  }, null, null, [[0, 19]]);
};

var progressController = function progressController(req, res) {
  var userId, student, totalCourses, _completedCourses, coursesPercentage, coursesData;

  return regeneratorRuntime.async(function progressController$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          userId = req.user.id;
          _context9.next = 4;
          return regeneratorRuntime.awrap(Student.findById(userId));

        case 4:
          student = _context9.sent;

          if (student) {
            _context9.next = 7;
            break;
          }

          return _context9.abrupt("return", res.status(404).json({
            message: "Student not found"
          }));

        case 7:
          totalCourses = student.enrolled.length;
          _completedCourses = student.enrolled.filter(function (course) {
            return course.isComplete;
          }).length;
          coursesPercentage = _completedCourses / totalCourses * 100;
          coursesData = {
            totalCourses: totalCourses,
            completedCourses: _completedCourses,
            coursesPercentage: coursesPercentage
          };
          res.status(200).json({
            message: "Progress report",
            Progress: coursesData
          });
          _context9.next = 17;
          break;

        case 14:
          _context9.prev = 14;
          _context9.t0 = _context9["catch"](0);
          res.json({
            message: _context9.t0.message
          });

        case 17:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

var courseProgress = function courseProgress(req, res) {
  var studentId, student, results;
  return regeneratorRuntime.async(function courseProgress$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.prev = 0;
          studentId = req.user.id;
          _context11.next = 4;
          return regeneratorRuntime.awrap(Student.findById(studentId).populate("enrolled"));

        case 4:
          student = _context11.sent;

          if (student) {
            _context11.next = 7;
            break;
          }

          return _context11.abrupt("return", res.status(404).json({
            message: "Student not found"
          }));

        case 7:
          _context11.next = 9;
          return regeneratorRuntime.awrap(Promise.all(student.enrolled.map(function _callee(course) {
            var result;
            return regeneratorRuntime.async(function _callee$(_context10) {
              while (1) {
                switch (_context10.prev = _context10.next) {
                  case 0:
                    _context10.next = 2;
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
                    result = _context10.sent;
                    return _context10.abrupt("return", {
                      course: course,
                      progress: result[0]
                    });

                  case 4:
                  case "end":
                    return _context10.stop();
                }
              }
            });
          })));

        case 9:
          results = _context11.sent;
          res.json(results);
          _context11.next = 16;
          break;

        case 13:
          _context11.prev = 13;
          _context11.t0 = _context11["catch"](0);
          res.status(500).json({
            message: "Internal server error",
            error: _context11.t0.message
          });

        case 16:
        case "end":
          return _context11.stop();
      }
    }
  }, null, null, [[0, 13]]);
}; //filtering Records 


var filter = function filter(req, res) {
  var query, paidCourses, freeCourses;
  return regeneratorRuntime.async(function filter$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.prev = 0;
          query = req.query.f;
          console.log(query);

          if (!(query.toLowerCase() === 'paid')) {
            _context12.next = 10;
            break;
          }

          _context12.next = 6;
          return regeneratorRuntime.awrap(courseModel.find().where('price').gt(0));

        case 6:
          paidCourses = _context12.sent;
          return _context12.abrupt("return", res.status(200).json({
            message: "Paid courses",
            paidCourses: paidCourses
          }));

        case 10:
          if (!(query.toLowerCase() === 'free')) {
            _context12.next = 15;
            break;
          }

          _context12.next = 13;
          return regeneratorRuntime.awrap(courseModel.find().where('price').eq(0));

        case 13:
          freeCourses = _context12.sent;
          return _context12.abrupt("return", res.status(200).json({
            message: "free courses",
            freeCourses: freeCourses
          }));

        case 15:
          res.json({
            message: "No courses available based on Query"
          });
          _context12.next = 21;
          break;

        case 18:
          _context12.prev = 18;
          _context12.t0 = _context12["catch"](0);
          res.status(500).json({
            message: "Internal server error",
            Error: _context12.t0.message
          });

        case 21:
        case "end":
          return _context12.stop();
      }
    }
  }, null, null, [[0, 18]]);
};

var sorting = function sorting(req, res) {
  var query, courses, _courses, _courses2;

  return regeneratorRuntime.async(function sorting$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.prev = 0;
          query = req.query.sort;

          if (!(query.toLowerCase() === "asc")) {
            _context13.next = 9;
            break;
          }

          _context13.next = 5;
          return regeneratorRuntime.awrap(courseModel.find().sort({
            title: 1
          }));

        case 5:
          courses = _context13.sent;
          return _context13.abrupt("return", res.json({
            message: "Ascending order",
            course: courses
          }));

        case 9:
          if (!(query.toLowerCase() === "desc")) {
            _context13.next = 16;
            break;
          }

          _context13.next = 12;
          return regeneratorRuntime.awrap(courseModel.find().sort({
            title: -1
          }));

        case 12:
          _courses = _context13.sent;
          return _context13.abrupt("return", res.json({
            message: "Descending order",
            course: _courses
          }));

        case 16:
          if (!(query.toLowerCase() === "rating")) {
            _context13.next = 21;
            break;
          }

          _context13.next = 19;
          return regeneratorRuntime.awrap(courseModel.find().sort({
            rating: -1
          }));

        case 19:
          _courses2 = _context13.sent;
          return _context13.abrupt("return", res.json({
            message: "Rating order",
            course: _courses2
          }));

        case 21:
          res.json({
            message: "No Sorting chosen"
          });
          _context13.next = 27;
          break;

        case 24:
          _context13.prev = 24;
          _context13.t0 = _context13["catch"](0);
          res.status(500).json({
            message: "Internal server error",
            Error: _context13.t0.message
          });

        case 27:
        case "end":
          return _context13.stop();
      }
    }
  }, null, null, [[0, 24]]);
};

var ratingController = function ratingController(req, res) {
  var courseId, rating, userId, course, existingRating;
  return regeneratorRuntime.async(function ratingController$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          courseId = req.params.courseId;
          rating = req.query.rating;
          userId = req.user.id;
          console.log(userId);

          if (!(!rating || rating < 1 || rating > 5)) {
            _context14.next = 6;
            break;
          }

          return _context14.abrupt("return", res.status(400).send('Invalid rating. Must be between 1 and 5'));

        case 6:
          _context14.prev = 6;
          _context14.next = 9;
          return regeneratorRuntime.awrap(courseModel.findById(courseId));

        case 9:
          course = _context14.sent;

          if (course) {
            _context14.next = 12;
            break;
          }

          return _context14.abrupt("return", res.status(404).json('Course not found.'));

        case 12:
          existingRating = course.rating.find(function (r) {
            return r.ratedBy.toString() === userId;
          });

          if (!existingRating) {
            _context14.next = 15;
            break;
          }

          return _context14.abrupt("return", res.status(400).json({
            message: "You have already rated this course"
          }));

        case 15:
          course.rating.push({
            rate: Number(rating),
            ratedBy: userId
          });
          _context14.next = 18;
          return regeneratorRuntime.awrap(course.save());

        case 18:
          res.json({
            message: "Thank you for rating the course"
          });
          _context14.next = 24;
          break;

        case 21:
          _context14.prev = 21;
          _context14.t0 = _context14["catch"](6);
          res.status(500).json({
            message: "Internal server error",
            error: _context14.t0.message
          });

        case 24:
        case "end":
          return _context14.stop();
      }
    }
  }, null, null, [[6, 21]]);
};

var askQuestion = function askQuestion(req, res) {
  var _req$params2, videoId, courseId, question, askedBy, course, discussion;

  return regeneratorRuntime.async(function askQuestion$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _req$params2 = req.params, videoId = _req$params2.videoId, courseId = _req$params2.courseId;
          question = req.body.question;
          askedBy = req.user.id;
          _context15.prev = 3;
          _context15.next = 6;
          return regeneratorRuntime.awrap(courseModel.findById(courseId));

        case 6:
          course = _context15.sent;
          discussion = course.discussions;
          discussion.push({
            videoId: videoId,
            courseId: courseId,
            askedBy: askedBy,
            question: question
          });
          _context15.next = 11;
          return regeneratorRuntime.awrap(course.save());

        case 11:
          res.json({
            message: "We have got your question, you will get answer back from our instructor"
          });
          _context15.next = 17;
          break;

        case 14:
          _context15.prev = 14;
          _context15.t0 = _context15["catch"](3);
          res.status(500).json({
            message: "Internal server error",
            error: _context15.t0.message
          });

        case 17:
        case "end":
          return _context15.stop();
      }
    }
  }, null, null, [[3, 14]]);
};

var topDiscussions = function topDiscussions(req, res) {
  var _req$params3, courseId, videoId, course, discussion, data;

  return regeneratorRuntime.async(function topDiscussions$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _context16.prev = 0;
          _req$params3 = req.params, courseId = _req$params3.courseId, videoId = _req$params3.videoId;
          _context16.next = 4;
          return regeneratorRuntime.awrap(courseModel.findById(courseId));

        case 4:
          course = _context16.sent;
          discussion = course.discussions;
          data = [];
          discussion.map(function (item) {
            if (!item) {
              return res.json({
                Message: "There are discussions on this video"
              });
            }

            if (item.videoId.toString() === videoId) {
              console.log('Matched');
              data.push({
                question: item.question,
                answer: item.answer || 'waiting for answer',
                answeredBy: item.answeredBy || 'Instructor busy in Writing answer',
                createdAt: item.createdAt
              });
              return data;
            } else {
              console.log("No");
            }
          });

          if (data.length <= 10) {
            res.json({
              message: "Top ".concat(data.length, " discussions on this video"),
              Data: data
            });
          }

          _context16.next = 13;
          break;

        case 11:
          _context16.prev = 11;
          _context16.t0 = _context16["catch"](0);

        case 13:
        case "end":
          return _context16.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

module.exports = {
  getProfile: getProfile,
  enrollCourse: enrollCourse,
  showEnrolled: showEnrolled,
  topRanks: topRanks,
  completedCourses: completedCourses,
  progressController: progressController,
  courseProgress: courseProgress,
  filter: filter,
  sorting: sorting,
  markVideoAsComplete: markVideoAsComplete,
  editProfile: editProfile,
  editPassword: editPassword,
  ratingController: ratingController,
  askQuestion: askQuestion,
  topDiscussions: topDiscussions
};
//# sourceMappingURL=dashboardcontroller.dev.js.map

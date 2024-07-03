"use strict";

var courseModel = require('../models/course/courseModel.js');

var studentModel = require('../models/users/studentModel.js');

var reviewController = function reviewController(req, res) {
  var courseId, userId, review, course, student;
  return regeneratorRuntime.async(function reviewController$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          courseId = req.params.courseId;
          userId = req.user;
          review = req.body.review;
          _context.prev = 3;
          _context.next = 6;
          return regeneratorRuntime.awrap(courseModel.findById(courseId));

        case 6:
          course = _context.sent;
          _context.next = 9;
          return regeneratorRuntime.awrap(studentModel.findById({
            _id: userId.id
          }));

        case 9:
          student = _context.sent;

          if (!(!course || !student)) {
            _context.next = 12;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: "Course not found"
          }));

        case 12:
          course.reviews.push({
            reviewBy: {
              userId: student._id,
              review: review
            }
          });
          _context.next = 15;
          return regeneratorRuntime.awrap(course.save());

        case 15:
          res.status(201).json({
            message: "Review added successfully"
          });
          _context.next = 21;
          break;

        case 18:
          _context.prev = 18;
          _context.t0 = _context["catch"](3);
          res.status(500).json({
            message: _context.t0.message
          });

        case 21:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[3, 18]]);
};

module.exports = reviewController;
//# sourceMappingURL=reviewController.dev.js.map

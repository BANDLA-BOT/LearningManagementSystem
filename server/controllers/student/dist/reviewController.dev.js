"use strict";

var courseModel = require('../../models/course/courseModel');

var studentModel = require('../../models/users/studentModel.js');

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

var deleteReview = function deleteReview(req, res) {
  var _req$params, reviewedUserId, courseId, deletedReview;

  return regeneratorRuntime.async(function deleteReview$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$params = req.params, reviewedUserId = _req$params.reviewedUserId, courseId = _req$params.courseId;
          _context2.next = 4;
          return regeneratorRuntime.awrap(courseModel.findByIdAndUpdate(courseId, {
            $pull: {
              reviews: {
                'reviewBy.userId': reviewedUserId
              }
            }
          }, {
            "new": true
          }));

        case 4:
          deletedReview = _context2.sent;
          res.json({
            message: "Review deleted successfully",
            deletedReview: deletedReview
          });
          _context2.next = 11;
          break;

        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            message: "Internal server error",
            error: _context2.t0.message
          });

        case 11:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

module.exports = {
  reviewController: reviewController,
  deleteReview: deleteReview
};
//# sourceMappingURL=reviewController.dev.js.map

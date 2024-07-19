"use strict";

var courseModel = require("../../models/course/courseModel");

var studentModel = require("../../models/users/studentModel.js");

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
  var _req$params, courseId, reviewId, course, reviews, reviewDelete;

  return regeneratorRuntime.async(function deleteReview$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          _req$params = req.params, courseId = _req$params.courseId, reviewId = _req$params.reviewId;
          _context3.next = 4;
          return regeneratorRuntime.awrap(courseModel.findById(courseId));

        case 4:
          course = _context3.sent;
          reviews = course.reviews;
          reviewDelete = reviews.map(function _callee(item) {
            return regeneratorRuntime.async(function _callee$(_context2) {
              while (1) {
                switch (_context2.prev = _context2.next) {
                  case 0:
                    if (!(item._id.toString() === reviewId)) {
                      _context2.next = 3;
                      break;
                    }

                    _context2.next = 3;
                    return regeneratorRuntime.awrap(item.deleteOne({
                      reviewId: reviewId
                    }));

                  case 3:
                  case "end":
                    return _context2.stop();
                }
              }
            });
          });
          _context3.next = 9;
          return regeneratorRuntime.awrap(course.save());

        case 9:
          res.json(reviewDelete);
          _context3.next = 15;
          break;

        case 12:
          _context3.prev = 12;
          _context3.t0 = _context3["catch"](0);
          res.json(_context3.t0.message);

        case 15:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

module.exports = {
  reviewController: reviewController
};
//# sourceMappingURL=reviewController.dev.js.map

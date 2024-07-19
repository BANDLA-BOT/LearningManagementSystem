"use strict";

var courseModel = require('../../models/course/courseModel.js');

var deleteReview = function deleteReview(req, res) {
  var _req$params, courseId, reviewId, course, reviews, reviewDelete;

  return regeneratorRuntime.async(function deleteReview$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$params = req.params, courseId = _req$params.courseId, reviewId = _req$params.reviewId;
          _context2.next = 4;
          return regeneratorRuntime.awrap(courseModel.findById(courseId));

        case 4:
          course = _context2.sent;
          reviews = course.reviews;
          reviewDelete = reviews.map(function _callee(item) {
            return regeneratorRuntime.async(function _callee$(_context) {
              while (1) {
                switch (_context.prev = _context.next) {
                  case 0:
                    if (!(item._id.toString() === reviewId)) {
                      _context.next = 3;
                      break;
                    }

                    _context.next = 3;
                    return regeneratorRuntime.awrap(item.deleteOne({
                      reviewId: reviewId
                    }));

                  case 3:
                  case "end":
                    return _context.stop();
                }
              }
            });
          });
          _context2.next = 9;
          return regeneratorRuntime.awrap(course.save());

        case 9:
          res.json(reviewDelete);
          _context2.next = 15;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](0);
          res.json(_context2.t0.message);

        case 15:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

module.exports = {
  deleteReview: deleteReview
};
//# sourceMappingURL=reviewController.dev.js.map

"use strict";

var courseModel = require('../../models/course/courseModel.js');

var answerController = function answerController(req, res) {
  var _req$params, id, courseId, answer, answeredBy, course, discussion, disc;

  return regeneratorRuntime.async(function answerController$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$params = req.params, id = _req$params.id, courseId = _req$params.courseId;
          answer = req.body.answer;
          answeredBy = req.user.id;
          _context.next = 6;
          return regeneratorRuntime.awrap(courseModel.findById(courseId));

        case 6:
          course = _context.sent;
          discussion = course.discussions;
          disc = discussion.find(function (dis) {
            return dis._id.toString() === id;
          });
          disc.answeredBy = answeredBy, disc.answer = answer;
          _context.next = 12;
          return regeneratorRuntime.awrap(course.save());

        case 12:
          res.status(200).json({
            message: "Answer sent"
          });
          _context.next = 18;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: "internal server error",
            error: _context.t0.message
          });

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

module.exports = answerController;
//# sourceMappingURL=answerController.dev.js.map

"use strict";

var courseModel = require('./../../models/course/courseModel.js');

var questionsController = function questionsController(req, res) {
  var id, courses, discussions;
  return regeneratorRuntime.async(function questionsController$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          id = req.user.id;
          _context.next = 4;
          return regeneratorRuntime.awrap(courseModel.find({
            instructor: id
          }));

        case 4:
          courses = _context.sent;
          discussions = {
            answered: [],
            notAnswered: []
          };
          courses.forEach(function (course) {
            course.discussions.forEach(function (discussion) {
              if (discussion.answer) {
                discussions.answered.push(discussion);
              } else {
                discussions.notAnswered.push(discussion);
              }
            });
          });
          res.status(200).json(discussions);
          _context.next = 13;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: "Internal server error",
            error: _context.t0.message
          });

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

module.exports = questionsController;
//# sourceMappingURL=questionController.dev.js.map

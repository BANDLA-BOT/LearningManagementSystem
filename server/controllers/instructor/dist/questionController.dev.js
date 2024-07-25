"use strict";

var courseModel = require('./../../models/course/courseModel.js');

var questionsController = function questionsController(req, res) {
  var courses, course;
  return regeneratorRuntime.async(function questionsController$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(courseModel.find());

        case 3:
          courses = _context.sent;
          course = courses.map(function (item) {
            return item;
          });
          console.log(course);
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: "Internal server error",
            Error: _context.t0
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

module.exports = questionsController;
//# sourceMappingURL=questionController.dev.js.map

"use strict";

var Instructor = require('../../models/users/instructorModel.js');

var CourseModel = require('../../models/course/courseModel.js');

var mentorsController = function mentorsController(req, res) {
  var userId, mentors, courses, details, profile;
  return regeneratorRuntime.async(function mentorsController$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          userId = req.user.id;
          _context.next = 4;
          return regeneratorRuntime.awrap(Instructor.find());

        case 4:
          mentors = _context.sent;
          _context.next = 7;
          return regeneratorRuntime.awrap(CourseModel.find());

        case 7:
          courses = _context.sent;
          details = courses.map(function (item) {
            if (item.price) {
              return [item.title, item.description, item.price];
            }

            if (item.price <= 0) {
              return [item.title, item.description, 'FREE'];
            }
          });
          profile = {};
          mentors.map(function (item) {
            if (item._id.toString() === userId) {
              profile = item;
            }
          });
          res.status(200).json({
            message: "Data found",
            mentors: mentors,
            profile: profile,
            CoursesList: details
          });
          _context.next = 17;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: "Internal server error",
            Error: _context.t0.message
          });

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

module.exports = mentorsController;
//# sourceMappingURL=mentorsController.dev.js.map

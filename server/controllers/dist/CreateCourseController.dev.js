"use strict";

var CourseModel = require('../models/course/courseModel.js');

var createCourse = function createCourse(req, res) {
  var _req$body, title, price, rating, reviews, resources, description, instructor, section, newCourse;

  return regeneratorRuntime.async(function createCourse$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, title = _req$body.title, price = _req$body.price, rating = _req$body.rating, reviews = _req$body.reviews, resources = _req$body.resources, description = _req$body.description, instructor = _req$body.instructor, section = _req$body.section;
          newCourse = new CourseModel({
            title: title,
            price: price,
            rating: rating,
            reviews: reviews,
            description: description,
            instructor: instructor,
            resources: resources,
            section: section
          });
          _context.next = 5;
          return regeneratorRuntime.awrap(newCourse.save());

        case 5:
          res.json({
            message: "Course created successfully",
            Course: newCourse
          });
          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: "Internal server error",
            Error: _context.t0.message
          });

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
};

module.exports = createCourse;
//# sourceMappingURL=CreateCourseController.dev.js.map

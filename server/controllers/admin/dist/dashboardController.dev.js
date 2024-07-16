"use strict";

var courseModel = require('../../models/course/courseModel.js');

var student = require('../../models/users/studentModel.js');

var dashboardController = function dashboardController(req, res) {
  var Students, Courses;
  return regeneratorRuntime.async(function dashboardController$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(student.find().limit(20));

        case 3:
          Students = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(courseModel.find().limit(20));

        case 6:
          Courses = _context.sent;

          if (!(!Students || !Courses)) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: "Error while fetching Data"
          }));

        case 9:
          res.status(200).json({
            message: "Fetched Data",
            courses: Courses,
            students: Students
          });
          _context.next = 15;
          break;

        case 12:
          _context.prev = 12;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: "Internal server error",
            error: _context.t0.message
          });

        case 15:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 12]]);
};

var searchController = function searchController(req, res) {
  var query, Coursedata, studentsData;
  return regeneratorRuntime.async(function searchController$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          query = req.query.q;
          _context2.next = 4;
          return regeneratorRuntime.awrap(courseModel.find({
            $or: [{
              title: {
                $regex: query,
                $options: "i"
              }
            }]
          }));

        case 4:
          Coursedata = _context2.sent;
          _context2.next = 7;
          return regeneratorRuntime.awrap(student.find({
            $or: [{
              firstname: {
                $regex: query,
                $options: "i"
              }
            }, {
              lastname: {
                $regex: query,
                $options: 'i'
              }
            }, {
              email: {
                $regex: query,
                $options: 'i'
              }
            }]
          }));

        case 7:
          studentsData = _context2.sent;

          if (!(!Coursedata || !studentsData)) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: "Not found"
          }));

        case 10:
          res.status(200).json({
            message: "Results fetched",
            Students: studentsData,
            courses: Coursedata
          });
          _context2.next = 16;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            message: "Internal server error",
            error: _context2.t0.message
          });

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

module.exports = {
  dashboardController: dashboardController,
  searchController: searchController
};
//# sourceMappingURL=dashboardController.dev.js.map

"use strict";

var Instructor = require('../../models/users/instructorModel.js');

var CourseModel = require('../../models/course/courseModel.js');

var bcrypt = require('bcryptjs');

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

var editInstructorProfile = function editInstructorProfile(req, res) {
  var userId, _req$body, firstname, lastname, about, filePath, user;

  return regeneratorRuntime.async(function editInstructorProfile$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          userId = req.user.id;
          _req$body = req.body, firstname = _req$body.firstname, lastname = _req$body.lastname, about = _req$body.about;
          filePath = "".concat(req.file.destination, "/").concat(req.file.filename);
          _context2.next = 6;
          return regeneratorRuntime.awrap(Instructor.findOne({
            _id: userId
          }));

        case 6:
          user = _context2.sent;
          user.about = about;
          user.firstname = firstname;
          user.lastname = lastname;
          user.profilePic = filePath;
          _context2.next = 13;
          return regeneratorRuntime.awrap(user.save());

        case 13:
          res.json(user);
          _context2.next = 19;
          break;

        case 16:
          _context2.prev = 16;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            message: "Internal server error",
            Error: _context2.t0.message
          });

        case 19:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 16]]);
};

var editPassword = function editPassword(req, res) {
  var userId, _req$body2, currentPassword, newPassword, confirmPassword, user, comparePassword, hashedPassword;

  return regeneratorRuntime.async(function editPassword$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          userId = req.user.id;
          _req$body2 = req.body, currentPassword = _req$body2.currentPassword, newPassword = _req$body2.newPassword, confirmPassword = _req$body2.confirmPassword;
          _context3.next = 5;
          return regeneratorRuntime.awrap(Instructor.findById(userId));

        case 5:
          user = _context3.sent;
          comparePassword = bcrypt.compareSync(currentPassword, user.password);

          if (comparePassword) {
            _context3.next = 9;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: "Incorrect current password"
          }));

        case 9:
          if (!(currentPassword === newPassword)) {
            _context3.next = 11;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: "New password should be different than old password"
          }));

        case 11:
          if (!(newPassword !== confirmPassword)) {
            _context3.next = 13;
            break;
          }

          return _context3.abrupt("return", res.status(400).json({
            message: "Passwords did not match"
          }));

        case 13:
          hashedPassword = bcrypt.hashSync(newPassword, 10);
          user.password = hashedPassword;
          _context3.next = 17;
          return regeneratorRuntime.awrap(user.save());

        case 17:
          res.status(200).json({
            message: "Password changed successfully",
            User: user
          });
          _context3.next = 22;
          break;

        case 20:
          _context3.prev = 20;
          _context3.t0 = _context3["catch"](0);

        case 22:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 20]]);
};

module.exports = {
  mentorsController: mentorsController,
  editInstructorProfile: editInstructorProfile,
  editPassword: editPassword
};
//# sourceMappingURL=dashboardController.dev.js.map

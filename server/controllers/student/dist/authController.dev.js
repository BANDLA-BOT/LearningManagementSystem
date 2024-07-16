"use strict";

var Student = require('../../models/users/studentModel.js');

var jwt = require('jsonwebtoken');

require('dotenv').config(); //Register Controller


var register = function register(req, res) {
  var _req$body, email, firstname, lastname, password, user, newUser;

  return regeneratorRuntime.async(function register$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, email = _req$body.email, firstname = _req$body.firstname, lastname = _req$body.lastname, password = _req$body.password;
          _context.next = 4;
          return regeneratorRuntime.awrap(Student.findOne({
            email: email
          }));

        case 4:
          user = _context.sent;

          if (!user) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.json({
            message: "User already exists with the email ID"
          }));

        case 7:
          newUser = new Student({
            email: email,
            firstname: firstname,
            lastname: lastname,
            password: password
          });
          _context.next = 10;
          return regeneratorRuntime.awrap(newUser.save());

        case 10:
          res.status(201).json({
            Message: "Student registered successfully",
            Student: newUser
          });
          _context.next = 16;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            Message: "Internal server error",
            Error: _context.t0.message
          });

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 13]]);
}; //Login Controller


var login = function login(req, res) {
  var _req$body2, email, password, existUser, token;

  return regeneratorRuntime.async(function login$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          _context2.next = 4;
          return regeneratorRuntime.awrap(Student.findOne({
            email: email,
            password: password
          }));

        case 4:
          existUser = _context2.sent;

          if (existUser) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.json({
            message: "User doesn't exists"
          }));

        case 7:
          token = jwt.sign({
            id: existUser._id
          }, process.env.JWT_SECRET_KEY, {
            expiresIn: '15d'
          });
          res.status(200).json({
            message: "Student logged in successfully",
            student: existUser,
            Token: token
          });
          _context2.next = 14;
          break;

        case 11:
          _context2.prev = 11;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            Message: "Internal server error",
            Error: _context2.t0.message
          });

        case 14:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 11]]);
};

module.exports = {
  register: register,
  login: login
};
//# sourceMappingURL=authController.dev.js.map

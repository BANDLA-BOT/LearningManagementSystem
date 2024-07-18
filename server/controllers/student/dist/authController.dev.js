"use strict";

var Student = require("../../models/users/studentModel.js");

var jwt = require("jsonwebtoken");

require("dotenv").config();

var bcrypt = require("bcryptjs");

var twilio = require('twilio'); //Register Controller


var register = function register(req, res) {
  var _req$body, email, firstname, lastname, password, imgPath, user, hashedPassword, newUser;

  return regeneratorRuntime.async(function register$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, email = _req$body.email, firstname = _req$body.firstname, lastname = _req$body.lastname, password = _req$body.password;
          imgPath = "".concat(req.file.destination, "/").concat(req.file.filename);
          _context.next = 5;
          return regeneratorRuntime.awrap(Student.findOne({
            email: email
          }));

        case 5:
          user = _context.sent;

          if (!user) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", res.json({
            message: "User already exists with the email ID"
          }));

        case 8:
          hashedPassword = bcrypt.hashSync(password, 10);
          newUser = new Student({
            email: email,
            firstname: firstname,
            lastname: lastname,
            password: hashedPassword,
            profilepic: imgPath
          });
          _context.next = 12;
          return regeneratorRuntime.awrap(newUser.save());

        case 12:
          res.status(201).json({
            Message: "Student registered successfully",
            Student: newUser
          });
          _context.next = 18;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            Message: "Internal server error",
            Error: _context.t0.message
          });

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
}; //Login Controller


var login = function login(req, res) {
  var _req$body2, email, password, existUser, isPasswordMatch, token;

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
          isPasswordMatch = bcrypt.compareSync(password, existUser.password);

          if (isPasswordMatch) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", res.json({
            message: "Passwords did not match"
          }));

        case 10:
          token = jwt.sign({
            id: existUser._id
          }, process.env.JWT_SECRET_KEY, {
            expiresIn: "15d"
          });
          res.status(200).json({
            message: "Student logged in successfully",
            student: existUser,
            Token: token
          });
          _context2.next = 17;
          break;

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            Message: "Internal server error",
            Error: _context2.t0.message
          });

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

var sendOtp = function sendOtp(req, res) {
  var email, student, otp, numbers, len, i, accountSid, authToken;
  return regeneratorRuntime.async(function sendOtp$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          email = req.body.email;
          _context3.next = 4;
          return regeneratorRuntime.awrap(Student.find({
            email: email
          }));

        case 4:
          student = _context3.sent;

          if (student) {
            _context3.next = 9;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "No user found with this email ID"
          }));

        case 9:
          otp = "";
          numbers = "1234567890";
          len = numbers.length;

          for (i = 0; i < 6; i++) {
            otp += numbers[Math.floor(Math.random() * len)];
          }

          accountSid = 'USad386f4438ea7568b38b822db298048b';
          authToken = "";

        case 15:
          _context3.next = 20;
          break;

        case 17:
          _context3.prev = 17;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            message: "Internal server error",
            Error: _context3.t0.message
          });

        case 20:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 17]]);
};

var forgotPassword = function forgotPassword(req, res) {
  return regeneratorRuntime.async(function forgotPassword$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          try {
            console.log(req.cookies);
          } catch (error) {
            res.json({
              message: "Internal server error",
              Error: error.message
            });
          }

        case 1:
        case "end":
          return _context4.stop();
      }
    }
  });
};

module.exports = {
  register: register,
  login: login,
  sendOtp: sendOtp,
  forgotPassword: forgotPassword
};
//# sourceMappingURL=authController.dev.js.map

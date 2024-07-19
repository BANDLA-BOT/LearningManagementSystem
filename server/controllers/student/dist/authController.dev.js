"use strict";

var Student = require("../../models/users/studentModel.js");

var jwt = require("jsonwebtoken");

var bcrypt = require("bcryptjs");

var nodemailer = require('nodemailer'); //Register Controller


var register = function register(req, res) {
  var _req$body, email, firstname, lastname, password, imgPath, user, newUser;

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
          newUser = new Student({
            email: email,
            firstname: firstname,
            lastname: lastname,
            password: password,
            profilepic: imgPath
          });
          _context.next = 11;
          return regeneratorRuntime.awrap(newUser.save());

        case 11:
          res.status(201).json({
            Message: "Student registered successfully",
            Student: newUser
          });
          _context.next = 17;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            Message: "Internal server error",
            Error: _context.t0.message
          });

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 14]]);
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
          if (!(password !== existUser.password)) {
            _context2.next = 9;
            break;
          }

          return _context2.abrupt("return", res.json({
            message: "Passwords did not match"
          }));

        case 9:
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
          _context2.next = 16;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            Message: "Internal server error",
            Error: _context2.t0.message
          });

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var otpStore = new Map();

var sendOtp = function sendOtp(req, res) {
  var email, student, otp, otpExpiry, transporter, mailOptions;
  return regeneratorRuntime.async(function sendOtp$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          email = req.body.email;
          _context3.prev = 1;
          _context3.next = 4;
          return regeneratorRuntime.awrap(Student.findOne({
            email: email
          }));

        case 4:
          student = _context3.sent;

          if (student) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: 'Student not found'
          }));

        case 7:
          otp = Math.floor(100000 + Math.random() * 900000).toString();
          otpExpiry = Date.now() + 300000;
          otpStore.set(email, {
            otp: otp,
            expires: otpExpiry
          });
          console.log(otpStore);
          transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });
          mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'OTP for resetting Password',
            text: "Your OTP code is ".concat(otp, ". It will expire in 5 minutes.")
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return res.status(500).json({
                message: 'Error sending email',
                error: error,
                info: info
              });
            }

            res.json({
              message: 'OTP sent'
            });
          });
          _context3.next = 19;
          break;

        case 16:
          _context3.prev = 16;
          _context3.t0 = _context3["catch"](1);
          res.status(500).json({
            message: 'Server error',
            error: _context3.t0
          });

        case 19:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[1, 16]]);
};

var verifyOTP = function verifyOTP(req, res) {
  var _req$body3, email, otp, storedOtp;

  return regeneratorRuntime.async(function verifyOTP$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _req$body3 = req.body, email = _req$body3.email, otp = _req$body3.otp;
          storedOtp = otpStore.get(email);
          console.log(storedOtp);

          if (storedOtp) {
            _context4.next = 5;
            break;
          }

          return _context4.abrupt("return", res.status(400).json({
            message: 'No OTP found for this email'
          }));

        case 5:
          if (!(storedOtp.otp === otp && storedOtp.expires > Date.now())) {
            _context4.next = 9;
            break;
          }

          return _context4.abrupt("return", res.json({
            message: 'OTP verified'
          }));

        case 9:
          return _context4.abrupt("return", res.status(400).json({
            message: 'Invalid or expired OTP'
          }));

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  });
};

var forgotPassword = function forgotPassword(req, res) {
  var _req$body4, email, newPassword, student, storedOtp;

  return regeneratorRuntime.async(function forgotPassword$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _req$body4 = req.body, email = _req$body4.email, newPassword = _req$body4.newPassword;
          _context5.prev = 1;
          _context5.next = 4;
          return regeneratorRuntime.awrap(Student.findOne({
            email: email
          }));

        case 4:
          student = _context5.sent;

          if (student) {
            _context5.next = 7;
            break;
          }

          return _context5.abrupt("return", res.status(404).json({
            message: 'Student not found'
          }));

        case 7:
          storedOtp = otpStore.get(email);

          if (storedOtp) {
            _context5.next = 10;
            break;
          }

          return _context5.abrupt("return", res.status(400).json({
            message: 'No OTP found for this email'
          }));

        case 10:
          student.password = newPassword;
          _context5.next = 13;
          return regeneratorRuntime.awrap(student.save());

        case 13:
          otpStore["delete"](email);
          return _context5.abrupt("return", res.json({
            message: 'Password changed successfully'
          }));

        case 17:
          _context5.prev = 17;
          _context5.t0 = _context5["catch"](1);
          res.status(500).json({
            message: 'Server error',
            error: _context5.t0
          });

        case 20:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[1, 17]]);
};

module.exports = {
  register: register,
  login: login,
  sendOtp: sendOtp,
  forgotPassword: forgotPassword,
  verifyOTP: verifyOTP
};
//# sourceMappingURL=authController.dev.js.map

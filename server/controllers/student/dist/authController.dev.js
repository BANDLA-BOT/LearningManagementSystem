"use strict";

var Student = require("../../models/users/studentModel.js");

var jwt = require("jsonwebtoken");

var bcrypt = require("bcryptjs");

var nodemailer = require('nodemailer'); //Register Controller


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
            Student: newUser,
            register: true
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
  var _req$body2, email, password, existUser, isValidPassword, token;

  return regeneratorRuntime.async(function login$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          console.log(email, password);
          _context2.next = 5;
          return regeneratorRuntime.awrap(Student.findOne({
            email: email
          }));

        case 5:
          existUser = _context2.sent;

          if (existUser) {
            _context2.next = 8;
            break;
          }

          return _context2.abrupt("return", res.json({
            message: "User doesn't exists"
          }));

        case 8:
          isValidPassword = bcrypt.compareSync(password, existUser.password);

          if (isValidPassword) {
            _context2.next = 11;
            break;
          }

          return _context2.abrupt("return", res.json({
            message: "Password incorrect"
          }));

        case 11:
          token = jwt.sign({
            id: existUser._id
          }, process.env.JWT_SECRET_KEY, {
            expiresIn: "15d"
          });
          res.status(200).json({
            message: "Student logged in successfully",
            student: existUser,
            Token: token,
            login: true
          });
          _context2.next = 18;
          break;

        case 15:
          _context2.prev = 15;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            Message: "Internal server error",
            Error: _context2.t0.message
          });

        case 18:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

var resetPasswordLink = function resetPasswordLink(req, res) {
  var email, student, resetToken, transporter, mailOptions;
  return regeneratorRuntime.async(function resetPasswordLink$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          email = req.body.email;
          _context3.next = 3;
          return regeneratorRuntime.awrap(Student.findOne({
            email: email
          }));

        case 3:
          student = _context3.sent;

          if (student) {
            _context3.next = 6;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            message: "User not found"
          }));

        case 6:
          resetToken = jwt.sign({
            id: student._id
          }, process.env.JWT_SECRET_KEY_FOR_RESET_PASSWORD_LINK, {
            expiresIn: '10m'
          });
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
            subject: 'Password reset Link',
            text: "Please use the following link to reset your password: http://localhost:8000/reset-password/".concat(resetToken)
          };
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
              return res.status(500).send('Error sending email');
            }

            res.send('Password reset email sent');
          });

        case 10:
        case "end":
          return _context3.stop();
      }
    }
  });
};

var resetPassword = function resetPassword(req, res) {
  var token, newPassword, decoded, userId, hashedPassword;
  return regeneratorRuntime.async(function resetPassword$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          token = req.params.token;
          newPassword = req.body.newPassword;
          _context4.prev = 2;
          decoded = jwt.verify(token, process.env.JWT_SECRET_KEY_FOR_RESET_PASSWORD_LINK);
          userId = decoded.id;
          _context4.next = 7;
          return regeneratorRuntime.awrap(bcrypt.hash(newPassword, 10));

        case 7:
          hashedPassword = _context4.sent;
          _context4.next = 10;
          return regeneratorRuntime.awrap(Student.findByIdAndUpdate(userId, {
            password: hashedPassword
          }));

        case 10:
          res.json({
            Message: "Password updated successfully"
          });
          _context4.next = 16;
          break;

        case 13:
          _context4.prev = 13;
          _context4.t0 = _context4["catch"](2);
          res.status(400).send('Invalid or expired token');

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[2, 13]]);
};

module.exports = {
  register: register,
  login: login,
  resetPasswordLink: resetPasswordLink,
  resetPassword: resetPassword
};
//# sourceMappingURL=authController.dev.js.map

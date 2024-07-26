"use strict";

var Instructor = require('../../models/users/instructorModel.js');

var bcrypt = require('bcryptjs');

var jwt = require('jsonwebtoken');

var nodemailer = require('nodemailer');

var registerController = function registerController(req, res) {
  var _req$body, firstname, lastname, email, password, imgPath, instructor, hashedPassword, newInstructor;

  return regeneratorRuntime.async(function registerController$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _req$body = req.body, firstname = _req$body.firstname, lastname = _req$body.lastname, email = _req$body.email, password = _req$body.password;
          imgPath = "".concat(req.file.destination, "/").concat(req.file.filename);
          _context.next = 5;
          return regeneratorRuntime.awrap(Instructor.findOne({
            email: email
          }));

        case 5:
          instructor = _context.sent;

          if (!instructor) {
            _context.next = 8;
            break;
          }

          return _context.abrupt("return", res.status(400).json({
            message: "User already exist with same Email ID"
          }));

        case 8:
          hashedPassword = bcrypt.hashSync(password, 10);
          newInstructor = new Instructor({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashedPassword,
            profilePic: imgPath
          });
          _context.next = 12;
          return regeneratorRuntime.awrap(newInstructor.save());

        case 12:
          res.status(201).json({
            message: "Registered successfully"
          });
          _context.next = 18;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: "Internal server error",
            Error: _context.t0.message
          });

        case 18:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 15]]);
};

var loginController = function loginController(req, res) {
  var _req$body2, email, password, instructor, token;

  return regeneratorRuntime.async(function loginController$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.prev = 0;
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          _context2.next = 4;
          return regeneratorRuntime.awrap(Instructor.findOne({
            email: email
          }));

        case 4:
          instructor = _context2.sent;

          if (instructor) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.status(404).json({
            message: "User not found on this email"
          }));

        case 7:
          isPasswordValid = bcrypt.compareSync(password, instructor.password);

          if (isPasswordValid) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", res.status(400).json({
            message: "Incorrect password"
          }));

        case 10:
          token = jwt.sign({
            id: instructor._id
          }, process.env.JWT_SECRET_KEY_INSTRUCTOR, {
            expiresIn: '15d'
          });
          res.status(201).json({
            message: "Logged in successfully",
            User: instructor,
            Token: token,
            login: true
          });
          _context2.next = 17;
          break;

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](0);
          res.status(500).json({
            message: "Internal server error",
            error: _context2.t0.message
          });

        case 17:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[0, 14]]);
};

var instructorPasswordResetLink = function instructorPasswordResetLink(req, res) {
  var email, instructor, resetToken, transporter, mailOptions;
  return regeneratorRuntime.async(function instructorPasswordResetLink$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.prev = 0;
          email = req.body.email;
          _context3.next = 4;
          return regeneratorRuntime.awrap(Instructor.findOne({
            email: email
          }));

        case 4:
          instructor = _context3.sent;

          if (student) {
            _context3.next = 7;
            break;
          }

          return _context3.abrupt("return", res.status(404).json({
            Message: "User not found"
          }));

        case 7:
          resetToken = jwt.sign({
            id: instructor._id
          }, process.env.JWT_INSTRUCTOR_PASSWORD_RESET_KEY, {
            expiresIn: '10m'
          });
          transporter = nodemailer.createTestAccount({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            },
            secure: true
          });
          mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password reset link',
            text: "Please use the following link to reset your password: http://localhost:8000/api/instructor/auth/reset-password/".concat(resetToken)
          };
          transporter.sendEmail(mailOptions, function (error, info) {
            if (error) {
              return res.status(500).send('Error while sending email');
            }

            res.send('Password reset email sent');
          });
          _context3.next = 16;
          break;

        case 13:
          _context3.prev = 13;
          _context3.t0 = _context3["catch"](0);
          res.status(500).json({
            Message: "Internal server error",
            Error: _context3.t0.message
          });

        case 16:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

var instructorResetPassword = function instructorResetPassword(req, res) {
  var token, newPassword, decoded, userId, hashedPassword;
  return regeneratorRuntime.async(function instructorResetPassword$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          token = req.params.token;
          newPassword = req.body.newPassword;
          decoded = jwt.verify(token, process.env.JWT_INSTRUCTOR_PASSWORD_RESET_KEY);
          userId = decoded.id;
          _context4.next = 7;
          return regeneratorRuntime.awrap(bcrypt.hash(newPassword, 10));

        case 7:
          hashedPassword = _context4.sent;
          _context4.next = 10;
          return regeneratorRuntime.awrap(Instructor.findByIdAndUpdate(userId, {
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
          _context4.t0 = _context4["catch"](0);
          res.status(500).json({
            Message: "Internal server error",
            error: _context4.t0.message
          });

        case 16:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 13]]);
};

module.exports = {
  registerController: registerController,
  loginController: loginController,
  instructorPasswordResetLink: instructorPasswordResetLink,
  instructorResetPassword: instructorResetPassword
};
//# sourceMappingURL=authController.dev.js.map

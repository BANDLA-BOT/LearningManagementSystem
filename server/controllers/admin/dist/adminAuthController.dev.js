"use strict";

var jwt = require('jsonwebtoken');

var adminModel = require('../../models/users/adminModel.js');

var bcrypt = require('bcryptjs');

var register = function register(req, res) {
  var _req$body, firstname, lastname, email, password, user, hashedPassword;

  return regeneratorRuntime.async(function register$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, firstname = _req$body.firstname, lastname = _req$body.lastname, email = _req$body.email, password = _req$body.password;
          _context.prev = 1;
          _context.next = 4;
          return regeneratorRuntime.awrap(adminModel.findOne({
            email: email
          }));

        case 4:
          user = _context.sent;

          if (!user) {
            _context.next = 7;
            break;
          }

          return _context.abrupt("return", res.status(200).json({
            message: "User already exists with email ID"
          }));

        case 7:
          hashedPassword = bcrypt.hashSync(password, 10);
          user = new adminModel({
            firstname: firstname,
            lastname: lastname,
            email: email,
            password: hashedPassword
          });
          _context.next = 11;
          return regeneratorRuntime.awrap(user.save());

        case 11:
          res.status(201).json({
            message: "Registered as admin",
            Admin: user
          });
          _context.next = 17;
          break;

        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](1);
          res.status(500).json({
            message: "Internal server error",
            error: _context.t0.message
          });

        case 17:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[1, 14]]);
};

var login = function login(req, res) {
  var _req$body2, email, password, user, isPasswordValid, token;

  return regeneratorRuntime.async(function login$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body2 = req.body, email = _req$body2.email, password = _req$body2.password;
          _context2.prev = 1;
          _context2.next = 4;
          return regeneratorRuntime.awrap(adminModel.findOne({
            email: email
          }));

        case 4:
          user = _context2.sent;

          if (user) {
            _context2.next = 7;
            break;
          }

          return _context2.abrupt("return", res.json({
            message: "Invalid credentials"
          }));

        case 7:
          isPasswordValid = bcrypt.compare(password, user.password);

          if (isPasswordValid) {
            _context2.next = 10;
            break;
          }

          return _context2.abrupt("return", res.json({
            message: "Password is incorrect"
          }));

        case 10:
          token = jwt.sign({
            _id: user._id
          }, process.env.ADMIN_ACCESS_KEY, {
            expiresIn: "15d"
          });
          res.json({
            message: "Logged in Successfully ",
            user: user,
            token: token
          });
          _context2.next = 16;
          break;

        case 14:
          _context2.prev = 14;
          _context2.t0 = _context2["catch"](1);

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[1, 14]]);
};

module.exports = {
  login: login,
  register: register
};
//# sourceMappingURL=adminAuthController.dev.js.map

"use strict";

var studentModel = require("../models/users/studentModel");

var sendOTP = function sendOTP(req, res, next) {
  var email, student, otp, numbers, len, i;
  return regeneratorRuntime.async(function sendOTP$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          email = req.body.email;
          _context.next = 4;
          return regeneratorRuntime.awrap(studentModel.find({
            email: email
          }));

        case 4:
          student = _context.sent;

          if (student) {
            _context.next = 9;
            break;
          }

          return _context.abrupt("return", res.status(404).json({
            message: "No user found with this email ID"
          }));

        case 9:
          otp = '';
          numbers = '1234567890';
          len = numbers.length;

          for (i = 0; i < 6; i++) {
            otp += numbers[Math.floor(Math.random() * len)];
          }

          req.otp = otp;
          next();

        case 15:
          _context.next = 20;
          break;

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](0);
          res.status(500).json({
            message: "Internal server error",
            Error: _context.t0.message
          });

        case 20:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 17]]);
};

module.exports = {
  sendOTP: sendOTP,
  verifyOTP: verifyOTP
};
//# sourceMappingURL=sendOTP.dev.js.map

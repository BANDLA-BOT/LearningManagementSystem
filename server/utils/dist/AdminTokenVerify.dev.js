"use strict";

var jwt = require("jsonwebtoken");

var validate = function validate(req, res, next) {
  var token;
  return regeneratorRuntime.async(function validate$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          token = req.headers.authorization && req.headers.authorization.split(" ")[1];

          if (token) {
            _context.next = 3;
            break;
          }

          return _context.abrupt("return", res.status(401).json({
            error: "Unauthorized"
          }));

        case 3:
          jwt.verify(token, process.env.ADMIN_ACCESS_KEY, function (err, decoded) {
            if (err) {
              return res.status(401).json({
                error: "Unauthorized"
              });
            }

            req.user = decoded;
            next();
          });

        case 4:
        case "end":
          return _context.stop();
      }
    }
  });
};

module.exports = validate;
//# sourceMappingURL=AdminTokenVerify.dev.js.map

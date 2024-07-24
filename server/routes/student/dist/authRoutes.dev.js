"use strict";

var express = require('express');

var multer = require('multer');

var fs = require('fs');

var _require = require('../../controllers/student/authController.js'),
    register = _require.register,
    login = _require.login,
    resetPassword = _require.resetPassword,
    resetPasswordLink = _require.resetPasswordLink;

var router = express.Router();

if (!fs.existsSync('/uploads')) {
  fs.mkdirSync('/uploads');
}

var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, '/uploads');
  },
  filename: function filename(req, file, cb) {
    cb(null, "".concat(Date.now(), "-student-").concat(file.originalname));
  }
});
var upload = multer({
  storage: storage
});
router.post('/register', upload.single('profile'), register);
router.post('/login', login);
router.post('/request-reset-password', resetPasswordLink);
router.post('/reset-password/:token', resetPassword);
module.exports = router;
//# sourceMappingURL=authRoutes.dev.js.map

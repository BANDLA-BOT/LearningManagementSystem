"use strict";

var express = require('express');

var multer = require('multer');

var _require = require('../../controllers/student/authController.js'),
    register = _require.register,
    login = _require.login,
    forgotPassword = _require.forgotPassword,
    sendOtp = _require.sendOtp;

var router = express.Router();
var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, 'uploads');
  },
  filename: function filename(req, file, cb) {
    cb(null, "".concat(Date.now(), "-").concat(file.originalname));
  }
});
var upload = multer({
  storage: storage
});
router.post('/register', upload.single('profile'), register);
router.post('/login', login);
router.put('/sendotp', sendOtp);
router.put('/forgotpassword', forgotPassword);
module.exports = router;
//# sourceMappingURL=authRoutes.dev.js.map

"use strict";

var express = require('express');

var router = express.Router();

var path = require('path');

var fs = require('fs');

var multer = require('multer');

var _require = require('../../controllers/instructor/authController.js'),
    registerController = _require.registerController,
    loginController = _require.loginController;

if (!fs.existsSync('/uploads')) {
  fs.mkdirSync('/uploads');
}

var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, '/uploads');
  },
  filename: function filename(req, file, cb) {
    cb(null, "".concat(Date.now(), "-Instructor-").concat(file.originalname));
  }
});
var upload = multer({
  storage: storage
});
router.post('/register', upload.single('profile'), registerController);
router.post('/login', loginController);
module.exports = router;
//# sourceMappingURL=auth.dev.js.map

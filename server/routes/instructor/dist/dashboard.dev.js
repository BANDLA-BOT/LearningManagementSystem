"use strict";

var express = require('express');

var instructorTokenVerify = require('./../../utils/instructorTokenVerify.js');

var questionsController = require('../../controllers/instructor/questionController.js');

var _require = require('../../controllers/instructor/dashboardController.js'),
    mentorsController = _require.mentorsController,
    editInstructorProfile = _require.editInstructorProfile,
    editPassword = _require.editPassword;

var multer = require('multer');

var router = express.Router(); //Multer for update profilePicture

var updateProfilePic = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, 'instructorProfilesPics');
  },
  filename: function filename(req, file, cb) {
    cb(null, "".concat(Date.now(), "-").concat(file.originalname));
  }
});
var uploadProfilePic = multer({
  storage: updateProfilePic
});
router.put('/editprofile', uploadProfilePic.single('updatedProfilePic'), instructorTokenVerify, editInstructorProfile);
router.put('/editpassword', instructorTokenVerify, editPassword);
router.get('/mentors', instructorTokenVerify, mentorsController);
router.get('/discussions', instructorTokenVerify, questionsController);
module.exports = router;
//# sourceMappingURL=dashboard.dev.js.map

"use strict";

var express = require("express");

var verifyToken = require("../../utils/verifyToken.js");

var _require = require('../../controllers/student/dashboardcontroller.js'),
    getProfile = _require.getProfile,
    enrollCourse = _require.enrollCourse,
    topRanks = _require.topRanks,
    progressController = _require.progressController,
    courseProgress = _require.courseProgress,
    filter = _require.filter,
    sorting = _require.sorting,
    resourceController = _require.resourceController,
    markVideoAsComplete = _require.markVideoAsComplete,
    completedCourses = _require.completedCourses,
    editProfile = _require.editProfile,
    editPassword = _require.editPassword,
    showEnrolled = _require.showEnrolled,
    ratingController = _require.ratingController;

var multer = require("multer");

var router = express.Router(); //Multer to upload resources

var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, 'resources');
  },
  filename: function filename(req, file, cb) {
    cb(null, "".concat(Date.now(), "-").concat(file.originalname));
  }
});
var upload = multer({
  storage: storage
}); //dashboard

router.get("/profile", verifyToken, getProfile);
router.put('/editProfile', verifyToken, editProfile);
router.put('/editpassword', verifyToken, editPassword);
router.post("/enroll/:courseId", verifyToken, enrollCourse);
router.get('/showenroll', verifyToken, showEnrolled);
router.post('/resources/:courseId', upload.single('file'), resourceController); // course completion 

router.post('/markvideoascomplete/:courseId/:videoId', verifyToken, markVideoAsComplete);
router.get('/completedCourses', verifyToken, completedCourses); //Ranking and progress

router.get("/ranking", verifyToken, topRanks);
router.get("/progress", verifyToken, progressController);
router.get('/courseprogress', verifyToken, courseProgress); //filter & sorting

router.get('/filter', filter);
router.get('/sorting', sorting); //Ratings

router.post('/rate/:courseId/rate', verifyToken, ratingController);
module.exports = router;
//# sourceMappingURL=dashboardRoutes.dev.js.map

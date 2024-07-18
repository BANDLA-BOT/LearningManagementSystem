"use strict";

var multer = require('multer');

var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null);
  }
});
//# sourceMappingURL=uploadPic.dev.js.map

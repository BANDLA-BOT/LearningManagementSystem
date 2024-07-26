"use strict";

var express = require('express');

var _require = require('../../controllers/admin/adminAuthController.js'),
    register = _require.register,
    login = _require.login,
    sendOTP = _require.sendOTP,
    verifyAndUpdate = _require.verifyAndUpdate;

var router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', sendOTP);
router.post('/forgot-password-reset', verifyAndUpdate);
module.exports = router;
//# sourceMappingURL=auth.dev.js.map

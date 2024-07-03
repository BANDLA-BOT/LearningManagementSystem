"use strict";

var express = require('express');

var _require = require('../controllers/authController.js'),
    register = _require.register,
    login = _require.login;

var router = express.Router();
router.post('/register', register);
router.post('/login', login);
module.exports = router;
//# sourceMappingURL=authRoutes.dev.js.map

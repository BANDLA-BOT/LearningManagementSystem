"use strict";

var express = require('express');

var adminTokenDecode = require('../../utils/AdminTokenVerify.js');

var _require = require('../../controllers/admin/dashboardController.js'),
    dashboardController = _require.dashboardController,
    searchController = _require.searchController;

var router = express.Router();
router.get('/', adminTokenDecode, dashboardController);
router.get('/search', searchController); // router.post('/')

module.exports = router;
//# sourceMappingURL=dashboard.dev.js.map

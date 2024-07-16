const express = require('express');
const adminTokenDecode = require('../../utils/AdminTokenVerify.js');
const {dashboardController, searchController} = require('../../controllers/admin/dashboardController.js');

const router = express.Router();
router.get('/', adminTokenDecode, dashboardController)
router.get('/search', searchController)
// router.post('/')
module.exports = router
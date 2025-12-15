const { stats } = require('../controllers/statsControllers');
const express = require('express');
const router = express.Router();

router.get('/admin/stats', stats);

module.exports = router;
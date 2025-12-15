const { updateAvatar } = require('../controllers/uploadavatarControllers');
const express = require('express');
const router = express.Router();


// Avatar upload route
router.post('/', updateAvatar);

module.exports = router;
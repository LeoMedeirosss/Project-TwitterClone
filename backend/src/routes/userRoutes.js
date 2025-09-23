const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const userController = require('../controllers/userController');

// Upload de avatar
router.post('/avatar', auth, upload.single('avatar'), userController.uploadAvatar);

// Remover avatar
router.delete('/avatar', auth, userController.removeAvatar);

module.exports = router;

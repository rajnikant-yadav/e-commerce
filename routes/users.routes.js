const express = require('express');
const { register, login, getProfile, editProfile } = require('../controllers/users.controller');
const router = express.Router();
const {authenticate} = require('../middlewares/auth')

router.post('/register', register);
router.post('/login', login);
router.get('/profile',authenticate, getProfile);
router.patch('/profile',authenticate, editProfile);

module.exports = router;

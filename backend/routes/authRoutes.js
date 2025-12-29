const express = require('express');
const router = express.Router();
const passport = require('passport');
const { registerTenant, loginUser, getCurrentUser } = require('../controllers/authController');

router.post('/register', registerTenant);
router.post('/login', loginUser);
router.get('/me', passport.authenticate('jwt', { session: false }), getCurrentUser);

module.exports = router;

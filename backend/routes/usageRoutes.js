const express = require('express');
const router = express.Router();
const passport = require('passport');
const { logUsage, getLogs } = require('../controllers/usageController');

// Log action - can be authenticated or just tenant-scoped
// For strict SaaS, usually authenticated.
router.post('/', passport.authenticate('jwt', { session: false }), logUsage);

router.get('/', passport.authenticate('jwt', { session: false }), getLogs);

module.exports = router;

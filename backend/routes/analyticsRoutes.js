const express = require('express');
const router = express.Router();
const passport = require('passport');
const { generateReport, getReports } = require('../controllers/analyticsController');

router.post('/generate', passport.authenticate('jwt', { session: false }), generateReport);
router.get('/', passport.authenticate('jwt', { session: false }), getReports);

module.exports = router;

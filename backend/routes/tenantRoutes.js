const express = require('express');
const router = express.Router();
const passport = require('passport');
const { getTenantInfo, updateBranding } = require('../controllers/tenantController');
const { upload } = require('../config/cloudinary');

router.get('/info', getTenantInfo);
router.put('/branding', passport.authenticate('jwt', { session: false }), upload.single('logo'), updateBranding);

module.exports = router;

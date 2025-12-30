const Tenant = require('../models/Tenant');
const UsageLog = require('../models/UsageLog');

// @desc    Get tenant info (public/protected mix)
// @route   GET /api/tenant/info
// @access  Public (if we know the ID)
const getTenantInfo = async (req, res) => {
    // If resolution middleware worked, we have req.tenant
    if (!req.tenant) {
        return res.status(404).json({ message: 'Tenant context missing' });
    }

    res.json({
        id: req.tenant._id,
        name: req.tenant.name,
        subdomain: req.tenant.subdomain,
        logoUrl: req.tenant.logoUrl,
        themeColor: req.tenant.themeColor,
    });
};

// @desc    Update tenant branding
// @route   PUT /api/tenant/branding
// @access  Private (Admin only)
const updateBranding = async (req, res) => {
    const { themeColor, logoUrl } = req.body;

    try {
        const tenant = await Tenant.findById(req.user.tenantId);

        if (!tenant) return res.status(404).json({ message: 'Tenant not found' });

        // Check permission
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update branding' });
        }

        if (themeColor) tenant.themeColor = themeColor;
        if (req.file) tenant.logoUrl = req.file.path;
        else if (logoUrl) tenant.logoUrl = logoUrl; // Fallback to string if passed directly

        await tenant.save();

        // Log Usage
        await UsageLog.create({
            tenantId: tenant._id,
            userId: req.user._id,
            action: 'UPDATE_BRANDING',
            details: `Updated branding: Color ${themeColor || 'kept'}, Logo ${req.file ? 'updated' : 'kept'}`,
        });

        res.json(tenant);
    } catch (error) {
        res.status(500).json({ message: 'Error updating branding' });
    }
};

module.exports = {
    getTenantInfo,
    updateBranding,
};

const Tenant = require('../models/Tenant');

const tenantResolver = async (req, res, next) => {
    // 1. Try header
    const tenantId = req.headers['x-tenant-id'];

    // 2. Try subdomain (optional, for production)
    // const host = req.hostname; 
    // const subdomain = host.split('.')[0];

    if (!tenantId) {
        // For now, if no tenant ID, we let it pass, but req.tenant will be undefined.
        // Some routes (like create tenant) might not need it.
        // However, if strict is required, we can block here.
        // The requirement says "Resolve tenant on EVERY request", implies attempt.
        return next();
    }

    try {
        const tenant = await Tenant.findById(tenantId);
        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }
        req.tenant = tenant;
        next();
    } catch (error) {
        console.error('Tenant resolution error:', error);
        res.status(500).json({ message: 'Server Error during tenant resolution' });
    }
};

module.exports = tenantResolver;

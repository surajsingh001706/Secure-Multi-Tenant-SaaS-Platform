const UsageLog = require('../models/UsageLog');

// @desc    Log a user action
// @route   POST /api/usage
// @access  Private (usually, but could be public with tenant context)
const logUsage = async (req, res) => {
    const { action, details } = req.body;

    if (!req.tenant) {
        return res.status(400).json({ message: 'Tenant context required' });
    }

    try {
        const log = await UsageLog.create({
            tenantId: req.tenant._id,
            userId: req.user ? req.user._id : null, // Optional if public usage
            action,
            details,
        });

        res.status(201).json(log);
    } catch (error) {
        console.error('Usage Log Error:', error);
        res.status(500).json({ message: 'Error logging usage' });
    }
};

// @desc    Get logs (internal/admin)
// @route   GET /api/usage
// @access  Private (Admin)
const getLogs = async (req, res) => {
    try {
        const logs = await UsageLog.find({ tenantId: req.tenant._id })
            .sort({ createdAt: -1 })
            .limit(100); // safety limit

        res.json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching logs' });
    }
};

module.exports = {
    logUsage,
    getLogs,
};

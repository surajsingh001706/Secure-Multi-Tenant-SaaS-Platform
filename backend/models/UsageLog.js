const mongoose = require('mongoose');

const usageLogSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    action: {
        type: String,
        required: true,
    },
    details: {
        type: mongoose.Schema.Types.Mixed,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('UsageLog', usageLogSchema);

const mongoose = require('mongoose');

const analyticsReportSchema = new mongoose.Schema({
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tenant',
        required: true,
    },
    weekStartDate: {
        type: Date,
        required: true,
    },
    weekEndDate: {
        type: Date,
        required: true,
    },
    totalActions: {
        type: Number,
        required: true,
    },
    aiInsights: {
        type: String, // The text output from Gemini
        required: true,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('AnalyticsReport', analyticsReportSchema);

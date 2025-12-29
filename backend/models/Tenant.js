const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    subdomain: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    logoUrl: {
        type: String,
        default: '',
    },
    themeColor: {
        type: String,
        default: '#3b82f6', // Default blue
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Tenant', tenantSchema);

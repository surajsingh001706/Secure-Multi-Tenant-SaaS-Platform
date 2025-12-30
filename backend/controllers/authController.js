const User = require('../models/User');
const Tenant = require('../models/Tenant');
const UsageLog = require('../models/UsageLog');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new tenant and admin user
// @route   POST /api/auth/register
// @access  Public
const registerTenant = async (req, res) => {
    const { tenantName, subdomain, name, email, password } = req.body;

    try {
        // 1. Check if subdomain exists
        const existingTenant = await Tenant.findOne({ subdomain });
        if (existingTenant) {
            return res.status(400).json({ message: 'Subdomain already taken' });
        }

        // 2. Create Tenant
        const tenant = await Tenant.create({
            name: tenantName,
            subdomain,
            // Default branding
            themeColor: '#3b82f6',
        });

        // 3. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Create Admin User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'admin',
            tenantId: tenant._id,
        });

        // 5. Generate Token
        const payload = {
            id: user._id,
            name: user.name,
            role: user.role,
            tenantId: tenant._id,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.status(201).json({
            success: true,
            token: 'Bearer ' + token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            tenant: {
                id: tenant._id,
                name: tenant.name,
                subdomain: tenant.subdomain,
            },
        });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ message: 'Server error during registration', error: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public (but requires tenant context ideally)
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const tenantId = req.headers['x-tenant-id'];

    // Ideally we should enforce tenantId here to ensure they log into the right place
    // But for flexibility, if unique email per tenant is enforced, we might need tenantId to disambiguate if we didn't do global unique.
    // We did `userSchema.index({ email: 1, tenantId: 1 }, { unique: true });`, so email allows duplicates across tenants.
    // THUS, tenantId IS REQUIRED to find the user.

    if (!tenantId) {
        return res.status(400).json({ message: 'Tenant ID header (x-tenant-id) is required for login' });
    }

    try {
        // Check user in specific tenant
        const user = await User.findOne({ email, tenantId });
        if (!user) {
            return res.status(404).json({ message: 'User not found in this tenant' });
        }

        // Check pass
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Token
        const payload = {
            id: user._id,
            name: user.name,
            role: user.role,
            tenantId: user.tenantId,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        // Log Usage
        await UsageLog.create({
            tenantId: user.tenantId,
            userId: user._id,
            action: 'LOGIN',
            details: `User ${user.name} logged in`,
        });

        res.json({
            success: true,
            token: 'Bearer ' + token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getCurrentUser = async (req, res) => {
    res.json({
        id: req.user.id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        tenantId: req.user.tenantId,
    });
};

module.exports = {
    registerTenant,
    loginUser,
    getCurrentUser,
};

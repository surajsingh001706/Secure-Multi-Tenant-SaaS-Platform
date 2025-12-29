const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Tenant = require('./models/Tenant');
const User = require('./models/User');
const UsageLog = require('./models/UsageLog');
const bcrypt = require('bcryptjs');

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/saas_platform')
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => console.error(err));

const seed = async () => {
    await Tenant.deleteMany({});
    await User.deleteMany({});
    await UsageLog.deleteMany({});

    // Create Tenant 1
    const tenant1 = await Tenant.create({
        name: 'Acme Corp',
        subdomain: 'acme',
        themeColor: '#ef4444', // Red
    });

    // Create Tenant 2
    const tenant2 = await Tenant.create({
        name: 'Beta Inc',
        subdomain: 'beta',
        themeColor: '#10b981', // Green
    });

    // Create Admin for Tenant 1
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    await User.create({
        name: 'Suraj',
        email: 'suraj@acme.com',
        password: hashedPassword,
        role: 'admin',
        tenantId: tenant1._id,
    });

    // Create Logs for Tenant 1
    const logs = [];
    for (let i = 0; i < 20; i++) {
        logs.push({
            tenantId: tenant1._id,
            action: i % 2 === 0 ? 'LOGIN_SUCCESS' : 'VIEW_DASHBOARD',
            details: { ip: '192.168.1.1' },
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000000000))
        });
    }
    await UsageLog.insertMany(logs);

    console.log('Data Seeded Successfully');
    console.log('Acme Corp (Red): ID=' + tenant1._id + ', User: suraj@acme.com / password123');
    console.log('Beta Inc (Green): ID=' + tenant2._id);
    process.exit();
};

seed();

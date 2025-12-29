const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('User');
const dotenv = require('dotenv');

dotenv.config();

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

module.exports = (passport) => {
    passport.use(
        new JwtStrategy(opts, async (jwt_payload, done) => {
            try {
                // Find user by ID
                // IMPORTANT: We should also ideally check if the user belongs to the current tenant
                // But the JWT should contain the tenantId to be safe.
                // For now, finding by ID is standard.
                const user = await User.findById(jwt_payload.id);

                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            } catch (err) {
                console.error(err);
                return done(err, false);
            }
        })
    );
};

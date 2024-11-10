// middleware/authMiddleware.js

const User = require('../models/User');

const auth = (role) => async (req, res, next) => {
    try {
        const { userId } = req.body;  // Expect `userId` to be passed in the request body for authorization

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ msg: 'User not found' });

        if (role && !role.includes(user.role)) {
            return res.status(403).json({ msg: 'Access denied' });
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(500).json({ msg: 'Server error' });
    }
};

module.exports = auth;

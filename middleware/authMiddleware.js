const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', ''); // Expecting Bearer token format

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    }

    try {
        // Verify token and attach user information to request
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Contains userId and role
        next();
    } catch (error) {
        res.status(400).json({ success: false, message: 'Invalid token.' });
    }
};

module.exports = authMiddleware;

// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id; // Attach user ID to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error(err);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = authMiddleware;

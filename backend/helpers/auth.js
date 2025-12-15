const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const hashPassword = async (password) => {  
    return await bcrypt.hash(password, 10);
}

const comparePasswords = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}

const isAdmin = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized - No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Forbidden - Admin access required' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
};

const isAuthenticated = async (req, res, next) => { 
    try {
        const { token } = req.cookies;
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized - No token provided' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ error: 'Unauthorized - User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
};

module.exports = { 
    hashPassword, 
    comparePasswords, 
    isAdmin, 
    isAuthenticated 
};
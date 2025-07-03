const jwt = require('jsonwebtoken');
const captainModel = require('../models/captain.model');
const blackListModel = require('../models/blacklistToken.model');

module.exports.captainAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Check if the token is blacklisted
        const isBlacklisted = await blackListModel.findOne({ token });
        if (isBlacklisted) {s
            return res.status(401).json({ message: 'Unauthorized' });
        }

        // Find the captain by ID
        const captain = await captainModel.findById(decoded.id);
        
        if (!captain) {
            return res.status(404).json({ message: 'captain not found' });
        }

        // Attach captain to request object
        req.captain = captain;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
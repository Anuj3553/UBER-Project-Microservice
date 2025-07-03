const captainModel = require('../models/captain.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklistToken.model');

module.exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if captain already exists
        const existingcaptain = await captainModel.findOne({ email });
        if (existingcaptain) {
            return res.status(400).json({ message: 'captain already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new captain
        const newcaptain = new captainModel({
            name,
            email,
            password: hashedPassword
        });

        // Save the captain to the database
        await newcaptain.save();

        // Generate a JWT token
        const token = jwt.sign({ id: newcaptain._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 3600000 // 1 hour
        });

        res.status(201).json({
            message: 'captain registered successfully',
            token: token,  // Return the token in the response
            captain: newcaptain  // Return the newly created captain
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the captain by email
        const captain = await captainModel.findOne({ email }).select('+password'); // Include password field for comparison
        if (!captain) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Check the password
        const isPasswordValid = await bcrypt.compare(password, captain.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: captain._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 3600000 // 1 hour
        });

        res.status(200).json({
            message: 'captain login successful',
            token: token,  // Return the token in the response
            captain: {
                id: captain._id,
                name: captain.name,
                email: captain.email,
                isAvailable: captain.isAvailable
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.logout = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(400).json({ message: 'No captain is logged in' });
        }

        await blacklistTokenModel.create({ token });
        res.clearCookie('token');
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.profile = async (req, res) => {
    try {
        const captain = req.captain; // captain is attached to req by auth middleware
        if (!captain) {
            return res.status(404).json({ message: 'captain not found' });
        }

        res.status(200).json({
            captain
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports.toggleAvailability = async (req, res) => {
    try {
        const captain = await captainModel.findById(req.captain._id); // captain is attached to req by auth middleware
        if (!captain) {
            return res.status(404).json({ message: 'captain not found' });
        }

        // Toggle availability
        captain.isAvailable = !captain.isAvailable;
        await captain.save();

        res.status(200).json({
            message: `captain is now ${captain.isAvailable ? 'available' : 'not available'}`,
            captain,
            isAvailable: captain.isAvailable
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
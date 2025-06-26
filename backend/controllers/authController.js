const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require('google-auth-library');


const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.jwt_secret, {
        expiresIn: "7d",
    });
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: "User already exists" });

        const user = await User({ name, email, password, phone });
        await user.save();
        const token = generateToken(user);
        res.status(201).json({ user, token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = generateToken(user);
        res.status(200).json({ user, token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getUsers = async (req, res) => {
    try {
        const user = await User.find();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve user', details: error.message });
    }
};



const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

exports.loginGoogle = async (req, res) => {
    const { token } = req.body;

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        const { email, name, picture, sub: googleId } = payload;

        let user = await User.findOne({ email });
        if (!user) {
            user = await User.create({ email, name, picture, googleId });
        }

        const jwtToken = jwt.sign({ id: user._id }, process.env.jwt_secret, {
            expiresIn: '7d',
        });

        res.json({ token: jwtToken, user });
    } catch (err) {
        console.error("Google login error", err);
        res.status(401).json({ message: 'Invalid token' });
    }
};


exports.logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ status: true, message: "Logged out successfully" });
    } catch (error) {
        res.status(500).json({ message: "Logout failed", error: error.message });
    }
};




// Update profile
exports.updateProfile = () => async (req, res) => {
    try {

        const { name, phone, country, timezone } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { name, phone, country, timezone },
            { new: true, runValidators: true }
        );

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Change password (only for non-Google users)
exports.updatePassword = () => async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Check if user is Google-authenticated
        if (user.googleId) {
            return res.status(400).json({ msg: 'Google-authenticated users cannot change password here' });
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Current password is incorrect' });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({ msg: 'Password updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

// Upload profile picture
exports.updatePicture = () => async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (req.file) {
            user.avatar = req.file.path; // or the URL if using cloud storage
            await user.save();
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
};

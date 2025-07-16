const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { OAuth2Client } = require('google-auth-library');
const Client = require("../models/Client");
const axios = require('axios');



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


function getFieldValue(fields, label) {
    const field = fields.find(f => f.label.toLowerCase() === label.toLowerCase());
    return field ? field.value : null;
}

function getGenderText(field) {
    const genderField = field.find(f => f.label.toLowerCase() === 'gender');
    if (!genderField || !genderField.value || !genderField.options) return null;

    const selectedId = genderField.value[0];
    const option = genderField.options.find(opt => opt.id === selectedId);
    return option ? option.text.charAt(0).toUpperCase() + option.text.slice(1) : null;
}


exports.tally = async (req, res) => {
    try {
        const { data } = req.body;
        const fields = data.fields;

        const fullName = getFieldValue(fields, 'full name');
        const email = getFieldValue(fields, 'email');
        const phone = getFieldValue(fields, 'phone');
        const birthDate = getFieldValue(fields, 'birthday');
        const address = getFieldValue(fields, 'address');
        const notes = getFieldValue(fields, 'notes');
        const token = getFieldValue(fields, 'token');
        const gender = getGenderText(fields);

        const decoded = jwt.verify(token, process.env.jwt_secret);
        const userId = decoded.id;
        const user = await User.findById(decoded.id)

        const newClient = new Client({
            userId,
            fullName,
            email,
            phone,
            gender,
            birthDate,
            address,
            notes,
        });

        await newClient.save();

        await axios.post('http://localhost:5678/webhook-test/capture-lead', {
            userId,
            userName: user.name,
            trainerEmail: user.email,
            fullName,
            email,
            phone, 
            gender,
            birthDate,
            address
        });

        res.status(200).json({ message: 'Client added from Tally form!' });
    } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).json({ message: 'Server error' , error });
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


exports.generateFromSubmit = async (req, res) => {
    try {
        const user = await User.findById(req.user.id)
        const { link } = req.body

        if (!link) {
            return res.status(400).json({ message: "Form link is required" })
        }

        const token = generateToken(user);

        const url = new URL(link)
        url.searchParams.set('token', token)
        res.status(200).json(url.toString())
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "Failed to generate form URL", error: error.message })
    }
};





exports.updateProfile = async (req, res) => {
    try {
        const { name, phone, country, timezone } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { name, phone, country, timezone },
            { new: true, runValidators: true }
        );
        if (!updatedUser) {
            return res.status(404).json({ error: 'User not found' });
        }
        console.log("User updated successfully")
        res.status(200).json({ status: true, message: 'User updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update User', details: error.message });
    }
};

// Change password (only for non-Google users)
exports.updatePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (user.googleId) {
            return res.status(400).json({ msg: 'Google-authenticated users cannot change password here' });
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Current password is incorrect' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        res.json({
            status: true,
            msg: 'Password updated successfully'
        });

    } catch (err) {
        res.status(500).json({
            status: false,
            message: 'Server Error'
        });
    }
};

exports.updatePicture = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (req.file) {
            user.picture = process.env.BASE_URL + req.file.path;
            await user.save();
        }
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};

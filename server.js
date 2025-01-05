// Backend (Node.js with Express)
// File: server.js
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/employee-tracker', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// User Schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            default: [0, 0]
        },
        lastUpdated: { type: Date, default: Date.now }
    }
});

const User = mongoose.model('User', userSchema);

// Authentication middleware
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'your_jwt_secret');
        const user = await User.findOne({ _id: decoded._id });
        
        if (!user) {
            throw new Error();
        }
        
        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

// Routes
// Signup
app.post('/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const hashedPassword = await bcrypt.hash(password, 8);
        
        const user = new User({
            email,
            password: hashedPassword,
            name
        });
        
        await user.save();
        const token = jwt.sign({ _id: user._id.toString() }, 'your_jwt_secret');
        res.status(201).send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

// Login
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        
        if (!user) {
            throw new Error('Unable to login');
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            throw new Error('Unable to login');
        }
        
        const token = jwt.sign({ _id: user._id.toString() }, 'your_jwt_secret');
        res.send({ user, token });
    } catch (e) {
        res.status(400).send({ error: 'Invalid credentials' });
    }
});

// Update location
app.post('/update-location', auth, async (req, res) => {
    try {
        const { latitude, longitude } = req.body;
        req.user.location.coordinates = [longitude, latitude];
        req.user.location.lastUpdated = new Date();
        await req.user.save();
        res.send(req.user);
    } catch (e) {
        res.status(400).send(e);
    }
});

// Get all users locations
app.get('/users-locations', auth, async (req, res) => {
    try {
        const users = await User.find({}, 'name location');
        res.send(users);
    } catch (e) {
        res.status(500).send(e);
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
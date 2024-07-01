const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/User');
const LoginLog = require('./models/LoginLog'); // Import LoginLog model if separate

const app = express();
const port = 3007;
const secretKey = 'your_secret_key';

mongoose.connect('mongodb://localhost:27017/user_service', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

// Function to generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, secretKey, { expiresIn: '1h' });
};

// Middleware to log login attempts
const logLoginAttempt = async (userId, success) => {
  try {
    const log = new LoginLog({
      userId,
      timestamp: new Date(),
      success,
    });
    await log.save();
  } catch (err) {
    console.error('Error logging login attempt:', err);
  }
};

// Routes

// Register a new user
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json(newUser);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Login user and generate JWT token
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      await logLoginAttempt(null, false);
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.password !== password) {
      await logLoginAttempt(user._id, false);
      return res.status(401).json({ error: 'Incorrect password' });
    }

    // Update lastLogin timestamp
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    // Log successful login attempt
    await logLoginAttempt(user._id, true);

    // Return token and user details
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`User Service listening at http://localhost:${port}`);
});

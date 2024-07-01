const mongoose = require('mongoose');

const loginLogSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  success: {
    type: Boolean,
    required: true,
  },
});

const LoginLog = mongoose.model('LoginLog', loginLogSchema);

module.exports = LoginLog;

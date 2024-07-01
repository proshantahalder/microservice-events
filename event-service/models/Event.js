// event-service/models/Event.js

const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  location: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const Event = mongoose.model('Event', eventSchema);

module.exports = Event;

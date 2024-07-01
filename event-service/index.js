const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Event = require('./models/Event'); // Import Event model

const app = express();
const port = 3005; // Ensure this matches the port you are using

mongoose.connect('mongodb://localhost:27017/event_service', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(bodyParser.json());

// Route to add a new event
app.post('/api/events', async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    
    // Create a new event instance
    const newEvent = new Event({
      title,
      description,
      date,
      location,
    });

    // Save the event to the database
    await newEvent.save();

    res.status(201).json(newEvent); // Return the created event
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to get all events
app.get('/api/events', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to get a single event by ID
app.get('/api/events/:eventId', async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to update an event by ID
app.put('/api/events/:eventId', async (req, res) => {
  const { eventId } = req.params;
  const { title, description, date, location } = req.body;

  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      eventId,
      { title, description, date, location },
      { new: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(updatedEvent);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Route to delete an event by ID
app.delete('/api/events/:eventId', async (req, res) => {
  const { eventId } = req.params;

  try {
    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Event Service listening at http://localhost:${port}`);
});

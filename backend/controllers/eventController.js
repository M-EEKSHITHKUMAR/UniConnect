const Event = require('../models/Event');
const EventDiscussion = require('../models/EventDiscussion');
const { cloudinary } = require('../config/cloudinary');

const getEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('createdBy', 'name email')
      .sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate(
      'createdBy',
      'name email'
    );
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const createEvent = async (req, res) => {
  try {
    const { title, description, venue, date, time, organizer, registrationLink } =
      req.body;
    const posterImage = req.file ? req.file.path : '';

    const event = await Event.create({
      title,
      description,
      venue,
      date,
      time,
      organizer,
      registrationLink,
      posterImage,
      createdBy: req.user._id,
    });

    const populated = await event.populate('createdBy', 'name email');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.posterImage) {
      try {
        const urlParts = event.posterImage.split('/');
        const filename = urlParts[urlParts.length - 1].split('.')[0];
        const folder = urlParts[urlParts.length - 2];
        await cloudinary.uploader.destroy(`${folder}/${filename}`);
      } catch (err) {
        console.log('Cloudinary delete warning:', err.message);
      }
    }

    await EventDiscussion.deleteMany({ event: event._id });
    await event.deleteOne();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getDiscussions = async (req, res) => {
  try {
    const discussions = await EventDiscussion.find({ event: req.params.id })
      .populate('author', 'name email department')
      .sort({ createdAt: 1 });
    res.json(discussions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addDiscussion = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const discussion = await EventDiscussion.create({
      message: req.body.message,
      author: req.user._id,
      event: req.params.id,
    });

    const populated = await discussion.populate(
      'author',
      'name email department'
    );
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const deleteDiscussion = async (req, res) => {
  try {
    const discussion = await EventDiscussion.findById(
      req.params.discussionId
    );
    if (!discussion)
      return res.status(404).json({ message: 'Discussion not found' });

    const isAdmin = req.user.email === 'admin@gmail.com';
    const isOwner =
      discussion.author.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      return res
        .status(403)
        .json({ message: 'Not authorized to delete this message' });
    }

    await discussion.deleteOne();
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  deleteEvent,
  getDiscussions,
  addDiscussion,
  deleteDiscussion,
};
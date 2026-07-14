const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  deleteEvent,
  getDiscussions,
  addDiscussion,
  deleteDiscussion,
} = require('../controllers/eventController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadEventPoster } = require('../config/cloudinary');

router.get('/', getEvents);
router.post('/', protect, adminOnly, uploadEventPoster.single('posterImage'), createEvent);
router.get('/:id', getEventById);
router.delete('/:id', protect, adminOnly, deleteEvent);
router.get('/:id/discussions', getDiscussions);
router.post('/:id/discussions', protect, addDiscussion);
router.delete('/:eventId/discussions/:discussionId', protect, deleteDiscussion);

module.exports = router;
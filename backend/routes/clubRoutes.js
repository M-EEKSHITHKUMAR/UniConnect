const express = require('express');
const router = express.Router();
const { getClubs, createClub } = require('../controllers/clubController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getClubs);
router.post('/', protect, adminOnly, createClub);

module.exports = router;
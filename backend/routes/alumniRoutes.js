const express = require('express');
const router = express.Router();
const { getAlumni, createAlumni } = require('../controllers/alumniController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getAlumni);
router.post('/', protect, adminOnly, createAlumni);

module.exports = router;
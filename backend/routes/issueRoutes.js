const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
  createIssue,
  getAllIssues,
  getIssueById,
  upvoteIssue,
  updateIssueStatus,
  deleteIssue,
  getTrendingIssues,
} = require('../controllers/issueController');
const { addComment, getComments } = require('../controllers/commentController');
const { protect, adminOnly } = require('../middleware/authMiddleware');
const { uploadIssueImage } = require('../config/cloudinary');


// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, 'uploads/'),
//   filename: (req, file, cb) =>
//     cb(null, `${Date.now()}-${file.originalname}`),
// });
// const upload = multer({
//   storage,
//   fileFilter: (req, file, cb) => {
//     const ext = path.extname(file.originalname).toLowerCase();
//     if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only image files are allowed'));
//     }
//   },
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
// });

router.get('/trending', getTrendingIssues);
router.get('/', getAllIssues);
router.post('/', protect, uploadIssueImage.single('image'), createIssue);
router.get('/:id', getIssueById);
router.put('/:id/upvote', protect, upvoteIssue);
router.put('/:id/status', protect, adminOnly, updateIssueStatus);
router.delete('/:id', protect, adminOnly, deleteIssue);

// Comment routes
router.post('/:id/comments', protect, addComment);
router.get('/:id/comments', getComments);

module.exports = router;
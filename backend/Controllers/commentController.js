const Comment = require('../models/Comment');
const Issue = require('../models/Issue');


const addComment = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    const comment = await Comment.create({
      text: req.body.text,
      author: req.user._id,
      issue: req.params.id,
    });

    const populated = await comment.populate('author', 'name email department profileImage');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ issue: req.params.id })
      .populate('author', 'name email department profileImage')
      .sort({ createdAt: 1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { addComment, getComments };
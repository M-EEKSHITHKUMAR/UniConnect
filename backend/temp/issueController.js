const Issue=require("../models/Issue.js");
const Comment=require("../models/Comment.js");

const createIssue=async(req,res)=>{
    try{
        const {title,description}=req.body;
        const image=req.file?`/uploads/${req.file.filename}`:'';
        const issue=await Issue.create({
            title,
            description,
            image,
            author: req.user._id,
        });
        const populated=await issue.populate('author','name email department profileImage');
        res.status(201).json(populated);
    }catch(error){
        res.status(500).json({message:error.message});
    }
};

const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate('author', 'name email department profileImage')
      .sort({ createdAt: -1 });
    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate(
      'author',
      'name email department profileImage'
    );
    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const upvoteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    const userId = req.user._id.toString();
    const alreadyUpvoted = issue.upvotes.map((id) => id.toString()).includes(userId);

    if (alreadyUpvoted) {
      issue.upvotes = issue.upvotes.filter((id) => id.toString() !== userId);
    } else {
      issue.upvotes.push(req.user._id);
    }

    await issue.save();
    const updated = await Issue.findById(issue._id).populate('author', 'name email department profileImage');
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update issue status (admin only)
// @route   PUT /api/issues/:id/status
// @access  Private/Admin
const updateIssueStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'In Progress', 'Resolved'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const issue = await Issue.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('author', 'name email department profileImage');

    if (!issue) return res.status(404).json({ message: 'Issue not found' });
    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete issue (admin only, resolved issues)
// @route   DELETE /api/issues/:id
// @access  Private/Admin
const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) return res.status(404).json({ message: 'Issue not found' });

    if (issue.status !== 'Resolved') {
      return res.status(400).json({ message: 'Only resolved issues can be deleted' });
    }

    await Comment.deleteMany({ issue: issue._id });
    await issue.deleteOne();
    res.json({ message: 'Issue deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get trending issues (top 10 upvoted, pending, last 24h)
// @route   GET /api/issues/trending
// @access  Public
const getTrendingIssues = async (req, res) => {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const issues = await Issue.find({
      status: 'Pending',
      createdAt: { $gte: since },
    })
      .populate('author', 'name email department profileImage')
      .sort({ upvotes: -1 })
      .limit(10);

    // Sort by upvote count descending
    const sorted = issues.sort((a, b) => b.upvotes.length - a.upvotes.length);
    res.json(sorted);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createIssue,
  getAllIssues,
  getIssueById,
  upvoteIssue,
  updateIssueStatus,
  deleteIssue,
  getTrendingIssues,
};


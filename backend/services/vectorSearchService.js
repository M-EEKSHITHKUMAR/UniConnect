const Issue = require('../models/Issue');

/**
 * Search for similar issues using MongoDB Atlas Vector Search
 */
const findSimilarIssues = async (embedding, options = {}) => {
  const {
    limit = 3,
    threshold = parseFloat(process.env.SIMILARITY_THRESHOLD) || 0.85,
    excludeIssueId = null,
  } = options;

  try {
    const pipeline = [
      {
        $vectorSearch: {
          index: 'issue_vector_index',
          path: 'embedding',
          queryVector: embedding,
          numCandidates: 50,
          limit: limit + (excludeIssueId ? 1 : 0),
        },
      },
      {
        $addFields: {
          similarityScore: { $meta: 'vectorSearchScore' },
        },
      },
      {
        $match: {
          similarityScore: { $gte: threshold },
          ...(excludeIssueId && { _id: { $ne: excludeIssueId } }),
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: 'author',
          foreignField: '_id',
          as: 'authorData',
        },
      },
      { $unwind: '$authorData' },
      // ✅ FIXED: only include fields, no exclusions mixed in
      {
        $project: {
          title: 1,
          description: 1,
          status: 1,
          upvotes: 1,
          image: 1,
          createdAt: 1,
          similarityScore: 1,
          author: {
            _id: '$authorData._id',
            name: '$authorData.name',
            email: '$authorData.email',
            department: '$authorData.department',
          },
        },
      },
      { $limit: limit },
    ];

    const results = await Issue.aggregate(pipeline);
    console.log(` Vector search found ${results.length} similar issues`);
    return results;
  } catch (error) {
    console.error('Vector search failed:', error.message);
    return [];
  }
};

module.exports = { findSimilarIssues };
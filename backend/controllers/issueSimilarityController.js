const {generateIssueEmbedding}=require('../services/embeddingService');
const {findSimilarIssues}=require('../services/vectorSearchService');

const checkSimilarity=async(req,res)=>{
    try{
        const {title, description}=req.body;
        if (!title || !description) {
            return res.status(400).json({ message: 'Title and description are required' });
        }
        const embedding=await generateIssueEmbedding(title, description);
        if (!embedding) {
            return res.json({
                hasSimilar: false,
                similarIssues: [],
                message: 'Similarity check skipped',
            });
        }
        const threshold=parseFloat(process.env.SIMILARITY_THRESHOLD) || 0.85;
        const similarIssues=await findSimilarIssues(embedding,{ limit: 3, threshold });

        const formatted = similarIssues.map((issue) => ({
            ...issue,
            similarityPercent: Math.round(issue.similarityScore * 100),
        }));
        return res.json({
            hasSimilar:formatted.length>0,
            similarIssues: formatted,
            threshold,
        });
    }catch(error){
        console.error('Similarity check error:', error.message);
        return res.json({
            hasSimilar: false,
            similarIssues: [],
            message: 'Similarity check skipped due to error',
        });
    }
};


module.exports = {checkSimilarity};
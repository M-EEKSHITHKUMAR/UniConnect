const {GoogleGenerativeAI}=require('@google/generative-ai');

const genAI=new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateEmbedding=async(text)=>{
    try{
        if(!process.env.GEMINI_API_KEY){
            console.warn('GEMINI API Key is Absent');
            return null;
        }
        const model=genAI.getGenerativeModel({model:'gemini-embedding-001'});
        const result=await model.embedContent({
            content:{
                parts:[{text:text.trim().slice(0, 2000) }],
                role:'user',
            },
        });
        const embedding=result.embedding?.values;
        if(!embedding || embedding.length===0){
            console.warn('EMpty embedding returned from GEMINI');
            return null;
        }
        return embedding;
    }catch(e){
        console.error('Embedding genrn Failed:', e.message);
        return null;
    }
}

const generateIssueEmbedding=async(title, description)=>{
    const text=`${title}. ${description}`;
    return await generateEmbedding(text);
};

module.exports={generateEmbedding, generateIssueEmbedding};
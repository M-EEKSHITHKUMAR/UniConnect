const mongoose=require('mongoose');
const connectDB=async()=>{
    try{
        const con=await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${con.connection.host}`);

    }catch(e){
        console.error(`MongoDB Error: ${e.message}`);
        
    }
}
module.exports=connectDB;
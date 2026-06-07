const mongoose=require('mongoose');

const otpSchema=new mongoose.Schema({
    email:{
        type: String,
        required: true,
        lowercase: true,
        trim:true,
    },
    otp:{
        type:String,
        required:true,
    },
    expiresAt:{
        type:Date,
        required:true,
        index:{expires:0},
    },
    verified:{
        type:Boolean,
        default:false,
    },
});

module.exports=mongoose.model('Otp',otpSchema);
const mongoose = require('mongoose');

const issueSchema=new mongoose.Schema(
    {
        title:{
            type:String,
            required: [true,'Title is Required'],
            trim:true,
            maxLength:200,
        },
        description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Resolved'],
      default: 'Pending',
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    upvotes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
        },
    ],
    },
    {timestamps: true}
);

module.exports = mongoose.model('Issue', issueSchema);
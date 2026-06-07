const mongoose = require('mongoose');

const alumniSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Alumni name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: [true, 'Phone is required'],
      trim: true,
    },
    graduationYear: {
      type: Number,
      required: true,
    },
    currentRole: {
      type: String,
      default: '',
    },
    company: {
      type: String,
      default: '',
    },
    department: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Alumni', alumniSchema);
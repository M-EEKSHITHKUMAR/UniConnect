const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const issueStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'uniconnect/issues',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1200, quality: 'auto', crop: 'limit' }],
  },
});

const uploadIssueImage = multer({
  storage: issueStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

module.exports = { cloudinary, uploadIssueImage };
const cloudinary = require('../config/cloudinary');
const ApiError = require('../utils/ApiError');

const uploadImage = async (fileBuffer, folder = 'erudex/images') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'image', transformation: [{ quality: 'auto', fetch_format: 'auto' }] },
      (error, result) => error ? reject(new ApiError(500, 'Image upload failed')) : resolve(result)
    );
    stream.end(fileBuffer);
  });
};

const uploadVideo = async (fileBuffer, folder = 'erudex/videos') => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: 'video', chunk_size: 6000000, eager: [{ streaming_profile: 'hd', format: 'm3u8' }], eager_async: true },
      (error, result) => error ? reject(new ApiError(500, 'Video upload failed')) : resolve(result)
    );
    stream.end(fileBuffer);
  });
};

const deleteFile = async (publicId, resourceType = 'image') => {
  await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
};

module.exports = { uploadImage, uploadVideo, deleteFile };

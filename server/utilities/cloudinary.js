const cloudinary = require("cloudinary").v2;
const dotenv = require("dotenv").config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.uploadImage = async (file) => {
  try {
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      file.tempFilePath
    );
    return { public_id, secure_url };
  } catch (err) {
    console.log(err);
    return err;
  }
};

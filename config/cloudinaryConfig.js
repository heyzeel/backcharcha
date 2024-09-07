require('dotenv').config();
const cloudinary = require("cloudinary").v2;

const cloudConfig = async(img)=>{
    let image;
    cloudinary.config({
        cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
        api_key : process.env.CLOUDINARY_API_KEY,
        api_secret : process.env.CLOUDINARY_API_SECRET
    });
    
    await cloudinary.uploader.upload(img).then(result=>image=result);
    return image
}

module.exports = cloudConfig;
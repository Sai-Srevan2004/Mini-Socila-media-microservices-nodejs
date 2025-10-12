const cloudinary = require('../config/cloudinary')
const logger=require('../utils/logger')

const uploadCloudinary = async (file) => {
    logger.info("Inside uploadToclouniary function..")
     return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream((error, uploadResult) => {
            if (error) {
                logger.warn("Error upoading file to clousinary",error)
                return reject(error);
            }
            return resolve(uploadResult);
        }).end(file.buffer);
    });
}


const deleteFromCloudinary=async(publicId)=>{
    try {
       const res=await cloudinary.uploader.destroy(publicId)
       logger.info("Deleted media from cloudinary successfully!") 
       return res
    } catch (error) {
        logger.error("Failed to delete media from cloudinary!")
        throw error
    }
}


module.exports={uploadCloudinary,deleteFromCloudinary}


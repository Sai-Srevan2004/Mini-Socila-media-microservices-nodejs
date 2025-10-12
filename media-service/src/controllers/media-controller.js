const { uploadCloudinary } = require('../utils/uploadToCloudinary')
const logger = require("../utils/logger")
const Media = require('../models/Media')


const mediaUpload = async (req, res) => {
    logger.info("Starting media upload");
    try {
        logger.info("File from req.file", req.file)
        if (!req.file) {
            logger.warn("No file found from req.file")
            return res.status(400).json({
                success: false,
                message: "No file found pls uplaod the file"
            })
        }

        const { originalname, mimetype, buffer } = req.file;
        const userId = req.user.userId;

        logger.info(`File details: name=${originalname}, type=${mimetype}`);
        logger.info("Uploading to cloudinary starting...");


        const cloudinaryResult = await uploadCloudinary(req.file)

        const newMedia = new Media({
            publicId: cloudinaryResult.public_id,
            originalName: originalname,
            mimeType: mimetype,
            url: cloudinaryResult.secure_url,
            userId: userId
        })

        await newMedia.save()
        logger.info("Uploaded to cloudinary sucessfully!");

        return res.status(201).json({
            success: true,
            message: "Media upload sucesfully to cloudinary adn also db"
        })


    } catch (error) {
        logger.error("Error creating media", error);
        res.status(500).json({
            success: false,
            message: "Error creating media",
        });
    }
}

//optional method
const getAllMedias = async (req, res) => {
  try {
     console.log(req.user.userId)
     const result =  await Media.find({userId : req.user.userId});

        if(result.length ===0){
           return res.status(404).json({
                success:false,
                message:"Cann't find any media for this user"
            })
        }

         return res.status(200).json({
            success:true,
            message:"Medias fetched successfully!",
            data:result
         })
  } catch (error) {
    logger.error("Error fetching medias", error);
    res.status(500).json({
      success: false,
      message: "Error fetching medias",
    });
  }
};

module.exports={mediaUpload,getAllMedias}
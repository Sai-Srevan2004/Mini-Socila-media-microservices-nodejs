const multer = require('multer')
const logger = require('../utils/logger')



const storage = multer.memoryStorage()
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024, } }).single("file")


const handleMulterError= (req, res,next)=> {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            logger.error("Multer error while uploading:", err);
            return res.status(400).json({
                sucess: false,
                message: "Multer error while uploading:",
                error: err.message,
                stack: err.stack,
            });
        } else if (err) {
            logger.error("Unknown error occured while uploading:", err);
            return res.status(500).json({
                message: "Unknown error occured while uploading:",
                error: err.message,
                stack: err.stack,
            });
        }

        // Everything went fine.
        if (!req.file) {
            return res.status(400).json({
                message: "No file found!",
            });
        }

        next();
    })
}

module.exports=handleMulterError
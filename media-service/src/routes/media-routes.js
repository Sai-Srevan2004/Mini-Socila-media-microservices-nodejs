const express = require('express')
const handleMulterError=require('../middlewares/multer-error-middleware')
const {authenticateRequest}=require('../middlewares/authMiddleware')

const { mediaUpload, getAllMedias } = require('../controllers/media-controller')


const router = express.Router()

router.post('/upload-media',authenticateRequest,handleMulterError,mediaUpload)
router.get('/get-allmedia',authenticateRequest,getAllMedias)

module.exports = router
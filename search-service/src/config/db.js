const mongoose=require('mongoose')
const logger = require('../utils/logger')
require('dotenv').config()


const DbConnection=async ()=>{
    try {
        console.log("----",process.env.MONGO_URI)

        await mongoose.connect(process.env.MONGO_URI)
        logger.info("Db connected Sucessfully!")
    } catch (error) {
        logger.error("Failed to Connect to DB!",error)
        process.exit(1)
    }
}

module.exports=DbConnection
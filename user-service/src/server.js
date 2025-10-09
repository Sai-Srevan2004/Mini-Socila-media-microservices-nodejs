const express=require('express')
const DbConnection=require('./config/db')

const logger=require('./utils/logger')
const helmet=require('helmet')
const cors=require('cors')
const cookieParser = require("cookie-parser");


const PORT=process.env.PORT || 3001

const app=express()

//DB connection function call
DbConnection()

app.use(cors())
app.use(express.json())
app.use(helmet())
app.use(cookieParser());


app.listen(PORT,()=>{
    logger.info("User Service started running at PORT:",PORT)
})


//unhandled promise rejection
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason:", reason);
});


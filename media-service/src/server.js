const express=require('express')
const DbConnection=require('./config/db')

const logger=require('./utils/logger')
const helmet=require('helmet')
const cors=require('cors')
const MediaRoutes=require('./routes/media-routes')
const ErrorHandler=require('./middlewares/ErrorHandler')
const { connectToRabbitMQ, consumeEvent } = require('./config/rabbitmq')
const { handlePostDeleted } = require('./rabbitmqEventHandlers/media-event-handler')


const PORT=process.env.PORT || 3002

const app=express()

//DB connection function call
DbConnection()

app.use(cors())
app.use(express.json())
app.use(helmet())

app.use('/api/media-service',MediaRoutes)



//here any error is thrown by a route it skips all other normal middlewares and comes to this middleware error hanlder.
app.use(ErrorHandler)

async function startServer()
{
  try {
    await connectToRabbitMQ()

    //consume events
    await consumeEvent('post.deleted',handlePostDeleted)

    app.listen(PORT,()=>{
    logger.info(`User Service started running at PORT:${PORT}`)
})

  } catch (error) {
    logger.error("Faield to to start server",error)
    process.exit(1)
  }
}

startServer()

//unhandled promise rejection
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason:", reason);
});


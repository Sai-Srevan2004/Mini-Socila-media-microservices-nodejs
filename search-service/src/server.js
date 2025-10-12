require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const errorHandler = require("./middlewares/ErrorHandler");
const logger = require("./utils/logger");
const searchRoutes = require("./routes/search-routes");
const DbConnection = require('./config/db')
const {connectToRabbitMQ,consumeEvent}=require('./config/rabbitmq')
const {handlePostCreated,handlePostDeleted}=require('./rabbitmqEventHandlers/search-event-handlers')
const app = express();
const PORT = process.env.PORT || 3004;


DbConnection()

//middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/search-service", searchRoutes);

app.use(errorHandler);

async function startServer() {
  try {
    await connectToRabbitMQ();

    //consume the events / subscribe to the events
    await consumeEvent("post.created", handlePostCreated);
    await consumeEvent("post.deleted", handlePostDeleted);

    app.listen(PORT, () => {
      logger.info(`Search service is running on port: ${PORT}`);
    });
  } catch (e) {
    logger.error(e, "Failed to start search service");
    process.exit(1);
  }
}

startServer();


//unhandled promise rejection
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason:", reason);
});

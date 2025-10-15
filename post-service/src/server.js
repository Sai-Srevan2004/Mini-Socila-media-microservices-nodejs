require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const postRoutes = require("./routes/post-routes");
const errorHandler = require("./middlewares/ErrorHandler");
const logger = require("./utils/logger");
const DbConnection = require('./config/db');
const { connectToRabbitMQ } = require("./config/rabbitmq");
const Redis = require("ioredis");

const app = express();
const PORT = process.env.PORT || 3003;

DbConnection()

const redisClient = new Redis(process.env.REDIS_URL);

//middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${req.body}`);
  next();
});

//rate limiting should be implemented

app.use('/api/post-service', (req, res, next) => {
    req.redisClient = redisClient;
    next();
}, postRoutes)

app.use(errorHandler);

async function startServer() {
    try {
        await connectToRabbitMQ();
        app.listen(PORT, () => {
            logger.info(`Post service running on port ${PORT}`);
        });
    } catch (error) {
        logger.error("Faild to connect to server!")
        process.exit(1)
    }

}

startServer()

//unhandled promise rejection

process.on("unhandledRejection", (reason, promise) => {
    logger.error("Unhandled Rejection at", promise, "reason:", reason);
});

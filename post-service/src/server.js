require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const postRoutes = require("./routes/post-routes");
const errorHandler = require("./middlewares/ErrorHandler");
const logger = require("./utils/logger");
const DbConnection = require('./config/db');
const { connectToRabbitMQ } = require("./config/rabbitmq");

const app = express();
const PORT = process.env.PORT || 3003;

DbConnection()


//middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api/post-service', postRoutes)

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

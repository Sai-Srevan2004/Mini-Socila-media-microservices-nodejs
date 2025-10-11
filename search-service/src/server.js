require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const errorHandler = require("./middlewares/ErrorHandler");
const logger = require("./utils/logger");
const searchRoutes = require("./routes/search-routes");
const DbConnection = require('./config/db')
const app = express();
const PORT = process.env.PORT || 3004;


DbConnection()

//middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/search-service", searchRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    logger.info(`Search service is running on port: ${PORT}`);
});

//unhandled promise rejection
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason:", reason);
});

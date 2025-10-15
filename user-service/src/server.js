const express=require('express')
const DbConnection=require('./config/db')

const logger=require('./utils/logger')
const helmet=require('helmet')
const cors=require('cors')
const { RateLimiterRedis } = require("rate-limiter-flexible");
const Redis = require("ioredis");
const { rateLimit } = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");
const cookieParser = require("cookie-parser");
const UserRoutes=require('./routes/user-routes')
const ErrorHandler=require('./middlewares/ErrorHandler')


const PORT=process.env.PORT || 3001

const app=express()

//DB connection function call
DbConnection()

const redisClient = new Redis(process.env.REDIS_URL);


app.use(cors())
app.use(express.json())
app.use(helmet())
app.use(cookieParser());


app.use((req, res, next) => {
  logger.info(`Received ${req.method} request to ${req.url}`);
  logger.info(`Request body, ${req.body}`);
  next();
});

//DDos protection and rate limiting
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 10,
  duration: 1,
});

app.use((req, res, next) => {
  rateLimiter
    .consume(req.ip)
    .then(() => next())
    .catch(() => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({ success: false, message: "Too many requests" });
    });
});

//Ip based rate limiting for sensitive endpoint register
const sensitiveEndpointsLimiterRegister = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({ success: false, message: "Too many requests" });
  },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
     prefix: "register"
  }),
});

//Ip based rate limiting for sensitive endpoint login

const sensitiveEndpointsLimiterLogin = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    logger.warn(`Sensitive endpoint rate limit exceeded for IP: ${req.ip}`);
    res.status(429).json({ success: false, message: "Too many requests" });
  },
  store: new RedisStore({
    sendCommand: (...args) => redisClient.call(...args),
     prefix: "login"
  }),
});


app.use("/api/user-service/register", sensitiveEndpointsLimiterRegister);
app.use("/api/user-service/login", sensitiveEndpointsLimiterLogin);

app.use('/api/user-service',UserRoutes)

//here any error is thron by a route it skips all other normal middlewares and comes to this middleware error hanlder.
app.use(ErrorHandler)


app.listen(PORT,()=>{
    logger.info(`User Service started running at PORT:${PORT}`)
})


//unhandled promise rejection
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at", promise, "reason:", reason);
});


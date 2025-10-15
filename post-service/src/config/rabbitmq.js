const amqp = require("amqplib");
const logger = require("../utils/logger");
require('dotenv').config()

let connection = null;
let channel = null;

const EXCHANGE_NAME = "mini_social_events";

async function connectToRabbitMQ(retries = 10, delay = 5000) {
  for (let i = 0; i < retries; i++) {
    try {
      connection = await amqp.connect(process.env.RABBITMQ_URL);
      channel = await connection.createChannel();
      await channel.assertExchange(EXCHANGE_NAME, "topic", { durable: false });

      logger.info("Connected to RabbitMQ");
      return channel;
    } catch (error) {
      logger.error(
        `Failed to connect to RabbitMQ (Attempt ${i + 1}/${retries})`
      );
      if (i === retries - 1) {
        logger.error("All retry attempts failed. RabbitMQ unreachable.");
        throw error;
      }
      await new Promise((res) => setTimeout(res, delay));
    }
  }
}

//publish  event
async function publishEvent(routingKey, message) {
  if (!channel) {
    await connectToRabbitMQ();
  }

  channel.publish(
    EXCHANGE_NAME,
    routingKey,
    Buffer.from(JSON.stringify(message))
  );
  logger.info(`Event published: ${routingKey}`);
}


module.exports = { connectToRabbitMQ,publishEvent };

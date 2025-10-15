const amqp = require("amqplib");
const logger = require("../utils/logger");

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

async function consumeEvent(routingKey, callback) {
  if (!channel) {
    await connectToRabbitMQ();
  }

  const q = await channel.assertQueue("", { exclusive: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
  channel.consume(q.queue, (msg) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());
      callback(content);
      channel.ack(msg);
    }
  });

  logger.info(`Subscribed to event: ${routingKey}`);
}

module.exports = { connectToRabbitMQ, consumeEvent };

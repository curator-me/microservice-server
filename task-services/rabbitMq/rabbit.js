const amqp = require("amqplib");

// Message broker
let channel, connection;

async function connectRabbitMQWithRetry(maxRetries = 5, delay = 3000) {
  let retryCount = maxRetries;

  while (retryCount > 0) {
    try {
      connection = await amqp.connect("amqp://rabbitmq");
      // connection = await amqp.connect("amqp://localhost:5672");
      channel = await connection.createChannel();
      await channel.assertQueue("task_created", { durable: true }); // Create a queue task_created.
      console.log("RabbitMQ connected successfully");
      return;
    } catch (err) {
      retryCount--;
      console.error(
        `RabbitMQ connection failed. Retries left: ${retryCount}`,
        err
      );
      if (retryCount === 0)
        throw new Error("Failed to connect to RabbitMQ after all retries");

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

function getChannel() {
  if (!channel) {
    throw new Error(
      "RabbitMQ channel not available. Call connectRabbitMQWithRetry first."
    );
  }
  return channel;
}

module.exports = { getChannel, connectRabbitMQWithRetry };

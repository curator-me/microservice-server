const amqp = require("amqplib");

let channel, connection;

async function connectRabbitMQWithRetry(maxRetries = 5, delay = 3000) {
  let retryCount = maxRetries;
  while (retryCount > 0) {
    try {
      connection = await amqp.connect("amqp://rabbitmq");
      channel = await connection.createChannel();
      await channel.assertQueue("task_created", { durable: true });
      console.log("RabbitMQ connected successfully");
      return;
    } catch (err) {
      console.error(`RabbitMQ retry left: ${retryCount}`, err);
      retryCount--;
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw new Error("Could not connect to RabbitMQ");
}

function publish(message) {
  if (!channel) return false;
  channel.sendToQueue("task_created", Buffer.from(JSON.stringify(message)));
  return true;
}

module.exports = { connectRabbitMQWithRetry, publish };

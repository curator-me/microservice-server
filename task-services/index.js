const express = require("express");
const body_parser = require("body-parser");
const cors = require("cors");
const connectDB = require('./database/db');

const taskRoutes = require("./controllers/tasks") 

const app = express();
const port = 3002;

// Middleware
app.use(body_parser.json());
app.use(
  cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
  })
);

// Connect to database only when NOT testing
if (process.env.NODE_ENV !== "test") {
  connectDB();
}

// Routers
app.use("/", taskRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ status: "OK", service: "Task Service" });
});


// Message broker
let channel, connection;

async function connectRabbitMQWithRetry(maxRetries = 5, delay = 3000) {
  let retryCount = maxRetries;

  while (retryCount > 0) {
    try {
      connection = await amqp.connect("amqp://rabbitmq");
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


app.listen(port, () => {
  console.log(`Task service app listening on port ${port}`);
  connectRabbitMQWithRetry();
});

module.exports = {
  app,
  getChannel,
};
const express = require("express");
const mongoose = require("mongoose");
const body_parser = require("body-parser");
const cors = require("cors");
const amqp = require("amqplib");
const connectDB = require('./database/db');
const Task = require('./models/Task');

const app = express();
const port = 3002;

app.use(body_parser.json());

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    origin: "http://localhost:5500",
  })
);

// Connect to database
connectDB();


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

app.get("/", (req, res) => {
  res.send("Task service is running");
});
app.get("/tasks/my", (req, res) => {
  res.send("Task service is running");
});

app.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.status(201).json(tasks);
});

app.post("/tasks/add", async (req, res) => {
  const { title, description, userId } = req.body;

  try {
    const newTask = new Task({ title, description, userId });
    await newTask.save();
    if (!channel) {
      return res.status(503).json({ error: "RabbitMQ not connected" });
    }

    const message = {
      eventType: "TASK_CREATED",
      taskId: newTask._id.toString(),
      title: newTask.title,
      description: newTask.description,
      userId: newTask.userId,
      createdAt: newTask.createdAt,
      version: "1.0",
    };

    // Send to RabbitMQ queue
    channel.sendToQueue("task_created", Buffer.from(JSON.stringify(message)));

    res.status(201).json(newTask);
  } catch (err) {
    console.log("Error saving ", err);
    res.status(500).json({ err: "internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Task service app listening on port ${port}`);
  connectRabbitMQWithRetry();
});

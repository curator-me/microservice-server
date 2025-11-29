// controllers/tasks.js
const express = require("express");
const Task = require("../models/Task");
const { getChannel } = require("../rabbitMq/rabbit");

const router = express();

// Routers
router.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  res.status(200).json(tasks);
});

router.post("/tasks/add", async (req, res) => {
  const { title, description, userId } = req.body;
  console.log(title, description, userId);
  try {
    const newTask = new Task({ title, description, userId });
    await newTask.save();

    // Publish event to RabbitMQ
    const channel = getChannel();

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

module.exports = router;

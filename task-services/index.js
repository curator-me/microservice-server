const express = require("express");
const body_parser = require("body-parser");
const cors = require("cors");
const connectDB = require("./database/db");
const { connectRabbitMQWithRetry } = require("./rabbitMq/rabbit");

const taskRoutes = require("./controllers/tasks");

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
  res.status(200).json({ status: "OK", info: "Task Service is running..." });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(port, () => {
    console.log(`Task service app listening on port ${port}`);
    connectRabbitMQWithRetry();
  });
}

module.exports = app;

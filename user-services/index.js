const express = require("express");
const body_parser = require("body-parser");
const cors = require("cors");
const connectDB = require("./database/db");

const userRoutes = require("./controllers/users");

const app = express();
const port = 3001;

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
app.use("/", userRoutes);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({ status: "OK", info: "User Services is running!" });
});

app.listen(port, () => {
  console.log(`User service app listening on port ${port}`);
});

// Exporting for tests/user-services.test.js
module.exports = app;

// // 404 handler
// app.use((req, res) => {
//   res.status(404).json({ error: "Route not found" });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: "Something went wrong!" });
// });

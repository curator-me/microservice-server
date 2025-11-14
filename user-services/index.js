const express = require("express");
const mongoose = require("mongoose");
const body_parser = require("body-parser");
const cors = require("cors");
const connectDB = require("./database/db");
const User = require("./models/User");

const app = express();
const port = 3001;

app.use(body_parser.json());

app.use(
  cors({
    origin: "http://127.0.0.1:5500",
    origin: "http://localhost:5500",
  })
);

// Connect to database
connectDB();

// Routers
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.status(201).json(users);
});

app.post("/users", async (req, res) => {
  const { name, email } = req.body;

  try {
    const newuser = new User({ name, email });
    await newuser.save();
    res.status(201).json(newuser);
  } catch (err) {
    console.log("Error saving ", err);
    res.status(500).json({ err: "internal server error" });
  }
});

app.listen(port, () => {
  console.log(`User service app listening on port ${port}`);
});

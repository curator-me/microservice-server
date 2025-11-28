const express = require("express");
const mongoose = require("mongoose");
const body_parser = require("body-parser");
const cors = require("cors");
const connectDB = require("../database/db");
const User = require("../models/User");

const app = express();

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

// Routes
app.get("/", (req, res) => {
  res.send("User Services is running!");
});

app.get("/users", async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (err) {
    console.log("Error fetching user:", err);
    res.status(400).json({ error: "Invalid user ID" });
  }
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

module.exports = app;

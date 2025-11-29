// controllers/user.js
const express = require("express");
const User = require("../models/User");

const router = express();

// Routes
router.get("/users", async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

router.get("/users/:id", async (req, res) => {
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

router.post("/users", async (req, res) => {
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

module.exports = router;
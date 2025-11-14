const mongoose = require("mongoose");

// Schema
const taskSchema = mongoose.Schema({
  title: String,
  description: String,
  userId: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Model
module.exports = mongoose.model("Task", taskSchema);
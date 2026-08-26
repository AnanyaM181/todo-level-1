const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  text:        { type: String, required: true, trim: true, maxlength: 300 },
  description: { type: String, trim: true, maxlength: 1000, default: "" },
  completed:   { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Todo", todoSchema);
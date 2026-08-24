const express = require("express");
const Todo = require("../models/Todo");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth);

// GET /api/todos
router.get("/", async (req, res) => {
  const todos = await Todo.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(todos);
});

// POST /api/todos
router.post("/", async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ message: "Text is required." });
  const todo = await Todo.create({ user: req.user.id, text });
  res.status(201).json(todo);
});

// PATCH /api/todos/:id
router.patch("/:id", async (req, res) => {
  const todo = await Todo.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    req.body,
    { new: true }
  );
  if (!todo) return res.status(404).json({ message: "Not found." });
  res.json(todo);
});

// DELETE /api/todos/:id
router.delete("/:id", async (req, res) => {
  await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
  res.json({ message: "Deleted." });
});

module.exports = router;
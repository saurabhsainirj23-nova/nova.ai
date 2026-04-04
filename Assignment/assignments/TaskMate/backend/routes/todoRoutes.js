const express = require('express');
const router = express.Router();
const Todo = require('../models/Todo');

// Get all todos
router.get('/', async (req, res) => {
  const todos = await Todo.find().sort({ createdAt: -1 });
  res.json(todos);
});

// Add new todo
router.post('/', async (req, res) => {
  const todo = new Todo({ text: req.body.text });
  const saved = await todo.save();
  res.status(201).json(saved);
});

// Update todo (toggle complete or edit text)
router.put('/:id', async (req, res) => {
  const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
});

// Delete todo
router.delete('/:id', async (req, res) => {
  await Todo.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

module.exports = router;
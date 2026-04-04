import express from 'express';
import Assignment from '../models/Assignment.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const assignment = await Assignment.create(req.body);
  res.status(201).json(assignment);
});

router.get('/', async (req, res) => {
  const assignments = await Assignment.find().populate('courseId');
  res.json(assignments);
});

router.get('/:id', async (req, res) => {
  const assignment = await Assignment.findById(req.params.id).populate('courseId');
  if (!assignment) return res.status(404).send('Assignment not found');
  res.json(assignment);
});

router.put('/:id', async (req, res) => {
  const assignment = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(assignment);
});

router.delete('/:id', async (req, res) => {
  await Assignment.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

export default router;

import express from 'express';
import Course from '../models/Course.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const course = await Course.create(req.body);
  res.status(201).json(course);
});

router.get('/', async (req, res) => {
  const courses = await Course.find();
  res.json(courses);
});

router.get('/:id', async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) return res.status(404).send('Course not found');
  res.json(course);
});

router.put('/:id', async (req, res) => {
  const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(course);
});

router.delete('/:id', async (req, res) => {
  await Course.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

export default router;

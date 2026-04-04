import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Course from './models/Course.js';
import Assignment from './models/Assignment.js';

dotenv.config();

const seed = async () => {
  try {
await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected for Seeding');

    // Clear existing data
    await User.deleteMany();
    await Course.deleteMany();
    await Assignment.deleteMany();

    // Sample Users
    const users = await User.insertMany([
      { name: 'Alice Johnson', email: 'alice@example.com', role: 'student' },
      { name: 'Bob Smith', email: 'bob@example.com', role: 'student' },
      { name: 'Admin User', email: 'admin@example.com', role: 'admin' },
    ]);

    // Sample Courses
    const courses = await Course.insertMany([
      { title: 'Web Development', description: 'HTML, CSS, JS & React basics' },
      { title: 'Data Structures', description: 'Stacks, Queues, Trees, Graphs' },
    ]);

    // Sample Assignments (linked to courses)
    const assignments = await Assignment.insertMany([
      {
        courseId: courses[0]._id,
        title: 'HTML Assignment',
        content: 'Create a personal portfolio using HTML and CSS.',
        dueDate: new Date('2025-07-25'),
      },
      {
        courseId: courses[1]._id,
        title: 'Tree Traversal',
        content: 'Implement in-order, pre-order, and post-order traversal.',
        dueDate: new Date('2025-07-28'),
      },
    ]);

    console.log('✅ Seed data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
};

seed();

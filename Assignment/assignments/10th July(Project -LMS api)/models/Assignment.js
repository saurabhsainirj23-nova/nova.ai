import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
  title: String,
  content: String,
  dueDate: Date
});

export default mongoose.model('Assignment', assignmentSchema);

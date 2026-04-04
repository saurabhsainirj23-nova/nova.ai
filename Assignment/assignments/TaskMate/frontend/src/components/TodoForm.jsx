import React, { useState } from 'react';
import { addTodo } from '../api/todos';

export default function TodoForm({ onAdd }) {
  const [text, setText] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!text.trim()) return;
    await addTodo(text);
    setText('');
    onAdd();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={text}
        placeholder="Enter task..."
        onChange={(e) => setText(e.target.value)}
      />
      <button type="submit">Add</button>
    </form>
  );
}
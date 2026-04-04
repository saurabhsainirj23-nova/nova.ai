import React from 'react';
import { updateTodo, deleteTodo } from '../api/todos';

export default function TodoList({ todos, refresh }) {
  async function toggleDone(todo) {
    await updateTodo(todo._id, { completed: !todo.completed });
    refresh();
  }

  async function remove(todo) {
    await deleteTodo(todo._id);
    refresh();
  }

  return (
    <ul>
      {todos.map((t) => (
        <li key={t._id}>
          <span style={{ textDecoration: t.completed ? 'line-through' : 'none' }}>
            {t.text}
          </span>
          <button onClick={() => toggleDone(t)}>
            {t.completed ? 'Undo' : 'Done'}
          </button>
          <button onClick={() => remove(t)}>Delete</button>
        </li>
      ))}
    </ul>
  );
}
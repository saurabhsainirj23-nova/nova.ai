import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  // Fetch tasks when app starts
  useEffect(() => {
    axios.get(API_URL).then((res) => setTasks(res.data));
  }, []);

  const addTask = async () => {
    if (input.trim()) {
      const res = await axios.post(API_URL, { text: input });
      setTasks([...tasks, res.data]);
      setInput("");
    }
  };

  const toggleTask = async (id) => {
    const res = await axios.put(`${API_URL}/${id}`);
    setTasks(tasks.map((t) => (t._id === id ? res.data : t)));
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    setTasks(tasks.filter((t) => t._id !== id));
  };

  return (
    <div className="container">
      <h1>GoalOrbit 🚀</h1>

      <div className="task-input">
        <input
          type="text"
          placeholder="Enter your goal..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={addTask}>Add</button>
      </div>

      <div>
        {tasks.map((task) => (
          <div
            key={task._id}
            className={`task ${task.completed ? "completed" : ""}`}
          >
            <span onClick={() => toggleTask(task._id)}>{task.text}</span>
            <button onClick={() => deleteTask(task._id)}>🗑</button>
          </div>
        ))}
      </div>

      <p className="footer">Made with ❤ by Saurabh</p>
    </div>
  );
}

export default App;

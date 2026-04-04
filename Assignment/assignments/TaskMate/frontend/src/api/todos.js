import axios from 'axios';
const API = 'http://localhost:5000/api/todos';

export const getTodos = () => axios.get(API);
export const addTodo = (text) => axios.post(API, { text });
export const updateTodo = (id, data) => axios.put(`${API}/${id}`, data);
export const deleteTodo = (id) => axios.delete(`${API}/${id}`);

import './PackingList.css';
import React, { useState } from 'react';

function PackingList() {
  const [items, setItems] = useState([
    { id: 1, name: 'Toothbrush', isPacked: false }
  ]);
  const [newItem, setNewItem] = useState('');

  const handleAdd = () => {
    if (newItem.trim() === '') return;
    const newItemObj = {
      id: Date.now(),
      name: newItem,
      isPacked: false,
    };
    setItems([...items, newItemObj]);
    setNewItem('');
  };

  const togglePacked = (id) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, isPacked: !item.isPacked } : item
    ));
  };

  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  return (
    <div>
<div className="input-group">
  <input
    type="text"
    value={newItem}
    onChange={(e) => setNewItem(e.target.value)}
    placeholder="Add item..."
  />
  <button onClick={handleAdd}>Add</button>
</div>

      <ul className="list-group">
        {items.map(item => (
          <li
            key={item.id}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              item.isPacked ? 'list-group-item-success' : ''
            }`}
          >
            <span
              onClick={() => togglePacked(item.id)}
              style={{
                textDecoration: item.isPacked ? 'line-through' : 'none',
                cursor: 'pointer',
              }}
            >
              {item.isPacked ? '✔️' : '☐'} {item.name}
            </span>
            <button onClick={() => deleteItem(item.id)} className="btn btn-danger btn-sm">
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PackingList;

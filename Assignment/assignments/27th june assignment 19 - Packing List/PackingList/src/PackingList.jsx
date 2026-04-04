import './App.css'
import React, { useState } from 'react'

function PackingList() {
  const [items, setItems] = useState([
    { id: 1, name: 'Toothbrush', isPacked: false }
  ])
  const [text, setText] = useState('')

  function addItem() {
    if (text.trim() === '') return

    const newItem = {
      id: Date.now(),
      name: text,
      isPacked: false
    }
    setItems([...items, newItem])
    setText('')
  }

  function deleteItem(id) {
    const filtered = items.filter(item => item.id !== id)
    setItems(filtered)
  }

  function togglePacked(id) {
    const updated = items.map(item =>
      item.id === id ? { ...item, isPacked: !item.isPacked } : item
    )
    setItems(updated)
  }

  return (
    <div style={{ padding: '20px' }}>
      <div className="container">
      <h1>Packing List</h1>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Enter item name"
      />
      <button onClick={addItem}>Add</button>

      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {items.map(item => (
          <li key={item.id} style={{ margin: '10px 0' }}>
<span
  className={item.isPacked ? 'packed' : ''}
  onClick={() => togglePacked(item.id)}
>
  {item.isPacked ? '✔️' : '☐'} {item.name}
</span>
            <button onClick={() => deleteItem(item.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
    </div>
  )
}

export default PackingList;

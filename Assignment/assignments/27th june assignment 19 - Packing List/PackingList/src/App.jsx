import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import PackingList from './PackingList'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <PackingList/>

    </>
  )
}

export default App
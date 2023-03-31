import { useState } from 'react'
import './App.css'
import { Maze } from './Maze'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="App">
      <h1>oh hey. hi. hello.</h1>
      <p>i'm ray. <a href="https://twitter.com/rayhatfield">sometimes i tweet.</a></p>
      <Maze width={35} height={35} threshold={.5} />
      {/* <Maze width={10} height={10} /> */}
      <Maze width={18} height={18} threshold={.5} />
    </main>
  )
}

export default App

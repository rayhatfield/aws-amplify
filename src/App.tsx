import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <main className="App">
      <h1>oh hey. hi. hello.</h1>
      <p>i'm ray. <a href="https://twitter.com/rayhatfield">sometimes i tweet.</a></p>
    </main>
  )
}

export default App

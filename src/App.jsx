import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { FingeringPractice } from './components/FingeringPractice.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <FingeringPractice />
    </>
  )
}

export default App

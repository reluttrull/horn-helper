import { useState } from 'react'
import { FaBookOpen, FaChartLine, FaGear } from 'react-icons/fa6';
import './App.css'
import { FingeringPractice } from './components/FingeringPractice.jsx';

function App() {
  const [count, setCount] = useState(0);
  const Tabs = {
    FINGERINGPRACTICE: 'fingeringPractice',
    SETTINGS: 'settings',
    MYLEADERBOARD: 'myLeaderboard',
    GLOBALLEADERBOARD: 'globalLeaderboard'
  };
  const [tab, setTab] = useState(Tabs.FINGERINGPRACTICE);

  return (
    <>
      <button onClick={() => {setTab(Tabs.FINGERINGPRACTICE)}}><FaBookOpen /></button>
      <button onClick={() => {setTab(Tabs.SETTINGS)}}><FaGear /></button>
      <button onClick={() => {setTab(Tabs.MYLEADERBOARD)}}><FaChartLine /></button>
      { tab == Tabs.FINGERINGPRACTICE ? <FingeringPractice /> : <div></div>}
      { tab == Tabs.SETTINGS ? <h2>Settings</h2> : <div></div>}
      { tab == Tabs.MYLEADERBOARD ? <h2>My Leaderboard</h2> : <div></div>}
    </>
  )
}

export default App

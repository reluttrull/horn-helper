import { useEffect, useState } from 'react'
import { FaBookOpen, FaChartLine, FaGear } from 'react-icons/fa6';
import './App.css'
import { FingeringPractice } from './components/FingeringPractice.jsx';
import { Settings } from './components/Settings.jsx';

function App() {
  const [count, setCount] = useState(0);
  const Tabs = {
    FINGERINGPRACTICE: 'fingeringPractice',
    SETTINGS: 'settings',
    MYLEADERBOARD: 'myLeaderboard',
    GLOBALLEADERBOARD: 'globalLeaderboard'
  };
  const [tab, setTab] = useState(Tabs.FINGERINGPRACTICE);
  const [firstTime, setFirstTime] = useState(localStorage.getItem('lastLogin') == null);
  const [hornType, setHornType] = useState(localStorage.getItem('hornType'));

  const closeModal = () => setFirstTime(false);

  const handleHornTypeChange = (event) => {
    if (event.target.value != "...") {
      setHornType(event.target.value);
      localStorage.setItem('hornType', event.target.value);
      if (firstTime) {
        localStorage.setItem('lastLogin', new Date().toDateString());
        setFirstTime(false);
      }
    }
  }

  useEffect (() => {
    if (!firstTime) {
      localStorage.setItem('lastLogin', new Date().toDateString());
    }
  }, []);

  return (
    <>
      {firstTime && (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>First time?</h2>
          <p>Choose your settings...</p>
          <label htmlFor="dropdown">What type of horn do you play?</label>
          <select id="hornTypeDropdown" value={hornType} onChange={handleHornTypeChange}>
            <option value="...">...</option>
            <option value="singleBb">Single Bb horn</option>
            <option value="standardDouble">Double horn</option>
          </select>  
          <button className={firstTime ? "invisible" : "visible"} onClick={closeModal}>Close</button>
        </div>
      </div>)}
      <button onClick={() => {setTab(Tabs.FINGERINGPRACTICE)}}><FaBookOpen /></button>
      <button onClick={() => {setTab(Tabs.SETTINGS)}}><FaGear /></button>
      <button onClick={() => {setTab(Tabs.MYLEADERBOARD)}}><FaChartLine /></button>
      { tab == Tabs.FINGERINGPRACTICE ? <FingeringPractice /> : <div></div>}
      { tab == Tabs.SETTINGS ? <Settings /> : <div></div>}
      { tab == Tabs.MYLEADERBOARD ? <h2>My Leaderboard</h2> : <div></div>}
    </>
  )
}

export default App

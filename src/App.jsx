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
  const [range, setRange] = useState(localStorage.getItem('range'));

  const closeModal = () => setFirstTime(false);

  const checkFirstTime = () => {
    if (hornType && range) {
      let lastLogin = localStorage.getItem('lastLogin');
      if (!lastLogin) {
        localStorage.setItem('lastLogin', new Date().toDateString());
      }
      return false;
    }
    else {
      return true;
    }
  }

  const handleHornTypeChange = (event) => {
    if (event.target.value != "...") {
      setHornType(event.target.value);
      localStorage.setItem('hornType', event.target.value);
      checkFirstTime();
    }
  }

  const handleRangeChange = (event) => {
    if (event.target.value != "...") {
      setRange(event.target.value);
      localStorage.setItem('range', event.target.value);
      checkFirstTime();
    }
  }

  useEffect (() => {
    checkFirstTime();
  }, []);

  return (
    <>
      {checkFirstTime() && (
      <div className="modal-overlay" onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>First time?</h2>
          <p>Choose your settings...</p>
          <div>
          <label htmlFor="dropdown">What type of horn do you play?</label>
          <select id="hornTypeDropdown" value={hornType} onChange={handleHornTypeChange}>
            <option value="...">...</option>
            <option value="singleBb">Single Bb horn</option>
            <option value="standardDouble">Double horn</option>
          </select>  
          </div>
          <div>
          <label htmlFor="dropdown">How wide a range do you want to practice?</label>
          <select id="rangeDropdown" value={range} onChange={handleRangeChange}>
            <option value="...">...</option>
            <option value="1octave">1 octave (C to C)</option>
            <option value="2octaves">2 octaves (F to F) [under construction]</option>
          </select>  
          </div>
          <button className={checkFirstTime() ? "invisible" : "visible"} onClick={closeModal}>Close</button>
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

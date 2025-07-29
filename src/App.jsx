import { useEffect, useState } from 'react'
import { FaBookOpen, FaChartLine, FaGear, FaPenToSquare } from 'react-icons/fa6';
import './App.css'
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { FingeringPractice } from './components/FingeringPractice.jsx';
import { Settings } from './components/Settings.jsx';
import { Leaderboard } from './components/Leaderboard.jsx';
import { Study } from './components/Study.jsx';
import { LocalStorageKeys, Ranges, HornTypes, AccidentalSettings } from './utils/GlobalKeys.js';

function App() {
  const [count, setCount] = useState(0);
  const Tabs = {
    FINGERINGPRACTICE: 'fingeringPractice',
    SETTINGS: 'settings',
    MYLEADERBOARD: 'myLeaderboard',
    GLOBALLEADERBOARD: 'globalLeaderboard',
    STUDY: 'study'
  };
  const [tab, setTab] = useState(Tabs.FINGERINGPRACTICE);
  const [firstTime, setFirstTime] = useState(localStorage.getItem('lastLogin') == null);
  const [hornType, setHornType] = useState(localStorage.getItem(LocalStorageKeys.HORNTYPE));
  const [range, setRange] = useState(localStorage.getItem(LocalStorageKeys.RANGE));
  const [useAccidentals, setUseAccidentals] = useState(localStorage.getItem(LocalStorageKeys.USEACCIDENTALS));

  const closeModal = () => setFirstTime(false);

  const checkFirstTime = () => {
    if (hornType && range && useAccidentals) {
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

  const handleSettingsChange = () => {
    setHornType(localStorage.getItem(LocalStorageKeys.HORNTYPE));
    setRange(localStorage.getItem(LocalStorageKeys.RANGE));
    setUseAccidentals(localStorage.getItem(LocalStorageKeys.USEACCIDENTALS));
    checkFirstTime();
  };

  useEffect (() => {
    checkFirstTime();
  }, []);

  return (
    <>
      {checkFirstTime() && (
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>First time?</h2>
          <p>Choose your settings...</p>
          <Settings triggerParent={handleSettingsChange} />
          <button className={checkFirstTime() ? "invisible" : "visible"} onClick={closeModal}>Close</button>
        </div>
      </div>)}
      <button alt="play" title="Play" 
            onClick={() => {setTab(Tabs.FINGERINGPRACTICE)}}><FaPenToSquare /></button>
      <button alt="study" title="Study" 
            onClick={() => {setTab(Tabs.STUDY)}}><FaBookOpen /></button>
      <button alt="settings" title="Settings" 
            onClick={() => {setTab(Tabs.SETTINGS)}}><FaGear /></button>
      <button alt="leaderboard" title="Leaderboard" 
            onClick={() => {setTab(Tabs.MYLEADERBOARD)}}><FaChartLine /></button>
      {!checkFirstTime() && (
      <ErrorBoundary>
        { tab == Tabs.FINGERINGPRACTICE ? <FingeringPractice /> : <div></div>}
        { tab == Tabs.STUDY ? <Study /> : <div></div>}
        { tab == Tabs.SETTINGS ? <div><h3>Settings</h3><Settings /></div> : <div></div>}
        { tab == Tabs.MYLEADERBOARD ? <Leaderboard /> : <div></div>}
      </ErrorBoundary>)}
    </>
  )
}

export default App

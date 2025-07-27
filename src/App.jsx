import { useEffect, useState } from 'react'
import { FaBookOpen, FaChartLine, FaClipboard, FaGear } from 'react-icons/fa6';
import './App.css'
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

  const handleHornTypeChange = (event) => {
    if (event.target.value != "...") {
      setHornType(event.target.value);
      localStorage.setItem(LocalStorageKeys.HORNTYPE, event.target.value);
      checkFirstTime();
    }
  }

  const handleRangeChange = (event) => {
    if (event.target.value != "...") {
      setRange(event.target.value);
      localStorage.setItem(LocalStorageKeys.RANGE, event.target.value);
      checkFirstTime();
    }
  }

  const handleAccidentalsChange = (event) => {
    if (event.target.value != "...") {
      setUseAccidentals(event.target.value);
      localStorage.setItem(LocalStorageKeys.USEACCIDENTALS, event.target.value);
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
            <label className="question" htmlFor="dropdown">What type of horn do you play?</label>
            <select id="hornTypeDropdown" value={hornType} onChange={handleHornTypeChange}>
              <option value="...">...</option>
              <option value={HornTypes.SINGLEBB}>Single Bb horn</option>
              <option value={HornTypes.DOUBLEHORN}>Double horn</option>
            </select>  
          </div>
          <div>
            <label className="question" htmlFor="dropdown">How wide a range do you want to practice?</label>
            <select id="rangeDropdown" value={range} onChange={handleRangeChange}>
              <option value="...">...</option>
              <option value={Ranges.ONEOCTAVE}>1 octave (C to C)</option>
              <option value={Ranges.TWOOCTAVES}>2 octaves (F to F)</option>
            </select>  
          </div>
          <div>
            <label className="question" htmlFor="dropdown">How many accidentals (♭/♯) do you want to practice?</label>
            <select id="accidentalsDropdown" value={useAccidentals} onChange={handleAccidentalsChange}>
              <option value="...">...</option>
              <option value={AccidentalSettings.NO}>none</option>
              <option value={AccidentalSettings.EASY}>only the most common few</option>
              <option value={AccidentalSettings.MOST}>almost all</option>
              <option value={AccidentalSettings.ALL}>all, including E♯, C♭, etc.</option>
            </select>  
          </div>
          <button className={checkFirstTime() ? "invisible" : "visible"} onClick={closeModal}>Close</button>
        </div>
      </div>)}
      <button onClick={() => {setTab(Tabs.FINGERINGPRACTICE)}}><FaClipboard /></button>
      <button onClick={() => {setTab(Tabs.STUDY)}}><FaBookOpen /></button>
      <button onClick={() => {setTab(Tabs.SETTINGS)}}><FaGear /></button>
      <button onClick={() => {setTab(Tabs.MYLEADERBOARD)}}><FaChartLine /></button>
      { tab == Tabs.FINGERINGPRACTICE ? <FingeringPractice /> : <div></div>}
      { tab == Tabs.STUDY ? <Study /> : <div></div>}
      { tab == Tabs.SETTINGS ? <Settings /> : <div></div>}
      { tab == Tabs.MYLEADERBOARD ? <Leaderboard /> : <div></div>}
    </>
  )
}

export default App

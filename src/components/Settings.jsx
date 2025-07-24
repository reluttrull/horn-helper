import React, { useState } from "react";

export const Settings = () => {
  const [hornType, setHornType] = useState(localStorage.getItem('hornType'));
  const [range, setRange] = useState(localStorage.getItem('range'));
  const [useAccidentals, setUseAccidentals] = useState(localStorage.getItem('accidentals'));

  const handleHornTypeChange = (event) => {
    if (event.target.value != "...") {
      setHornType(event.target.value);
      localStorage.setItem('hornType', event.target.value);
    }
  }

  const handleRangeChange = (event) => {
    if (event.target.value != "...") {
      setRange(event.target.value);
      localStorage.setItem('range', event.target.value);
    }
  }

  const handleAccidentalsChange = (event) => {
    if (event.target.value != "...") {
      setUseAccidentals(event.target.value);
      localStorage.setItem('accidentals', event.target.value);
    }
  }

  return (
    <div>
      <h3>Settings</h3>
      <div>
        <label className="question" htmlFor="dropdown">What type of horn do you play?</label>
        <select id="hornTypeDropdown" value={hornType} onChange={handleHornTypeChange}>
          <option value="...">...</option>
          <option value="singleBb">Single Bb horn</option>
          <option value="standardDouble">Double horn</option>
        </select>  
      </div>
      <div>
        <label className="question" htmlFor="dropdown">How wide a range do you want to practice?</label>
        <select id="rangeDropdown" value={range} onChange={handleRangeChange}>
          <option value="...">...</option>
          <option value="1octave">1 octave (C to C)</option>
          <option value="2octaves">2 octaves (F to F)</option>
        </select>  
      </div>
      <div>
        <label className="question" htmlFor="dropdown">How many accidentals (♭/♯) do you want to practice?</label>
        <select id="accidentalsDropdown" value={useAccidentals} onChange={handleAccidentalsChange}>
          <option value="...">...</option>
          <option value="no">none</option>
          <option value="easy">only the most common few</option>
          <option value="most">almost all</option>
          <option value="all">all, including E♯, C♭, etc.</option>
        </select>  
      </div>
    </div>
  );
};

export default Settings;
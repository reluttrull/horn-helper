import React, { useState } from "react";
import { LocalStorageKeys, Ranges, HornTypes, AccidentalSettings } from "../utils/GlobalKeys.js";

export const Settings = ({ triggerParent }) => {
  const [hornType, setHornType] = useState(localStorage.getItem(LocalStorageKeys.HORNTYPE));
  const [range, setRange] = useState(localStorage.getItem(LocalStorageKeys.RANGE));
  const [useAccidentals, setUseAccidentals] = useState(localStorage.getItem(LocalStorageKeys.USEACCIDENTALS));

  const handleHornTypeChange = (event) => {
    if (event.target.value != "...") {
      setHornType(event.target.value);
      localStorage.setItem(LocalStorageKeys.HORNTYPE, event.target.value);
    }
    if (triggerParent) {
      triggerParent();
    }
  }

  const handleRangeChange = (event) => {
    if (event.target.value != "...") {
      setRange(event.target.value);
      localStorage.setItem(LocalStorageKeys.RANGE, event.target.value);
    }
    if (triggerParent) {
      triggerParent();
    }
  }

  const handleAccidentalsChange = (event) => {
    if (event.target.value != "...") {
      setUseAccidentals(event.target.value);
      localStorage.setItem(LocalStorageKeys.USEACCIDENTALS, event.target.value);
    }
    if (triggerParent) {
      triggerParent();
    }
  }

  return (
    <div>
      <div className="setting setting-row">
        <label className="question setting-column" htmlFor="dropdown">What type of horn do you play?</label>
        <select id="horntype-dropdown" className="setting-column" value={hornType} onChange={handleHornTypeChange}>
          <option value="...">...</option>
          <option value={HornTypes.SINGLEBB}>Single Bb horn</option>
          <option value={HornTypes.SINGLEF}>Single F horn</option>
          <option value={HornTypes.DOUBLEHORN}>Double horn</option>
        </select>  
      </div>
      <div className="setting setting-row">
        <label className="question setting-column" htmlFor="dropdown">How wide a range do you want to practice?</label>
        <select id="range-dropdown" className="setting-column" value={range} onChange={handleRangeChange}>
          <option value="...">...</option>
          <option value={Ranges.ONEOCTAVE}>1 octave (C to C)</option>
          <option value={Ranges.TWOOCTAVES}>2 octaves (F to F)</option>
        </select>  
      </div>
      <div className="setting setting-row">
        <label className="question setting-column" htmlFor="dropdown">How many accidentals (♭/♯) do you want to practice?</label>
        <select id="accidentals-dropdown" className="setting-column" value={useAccidentals} onChange={handleAccidentalsChange}>
          <option value="...">...</option>
          <option value={AccidentalSettings.NO}>none</option>
          <option value={AccidentalSettings.EASY}>only a few of the most common</option>
          <option value={AccidentalSettings.MOST}>almost all</option>
          <option value={AccidentalSettings.ALL}>all, including E♯, C♭, etc.</option>
        </select>  
      </div>
    </div>
  );
};

export default Settings;
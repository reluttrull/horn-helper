import React, { useState } from "react";

export const Settings = () => {
  const [hornType, setHornType] = useState(localStorage.getItem('hornType'));

  const handleHornTypeChange = (event) => {
    if (event.target.value != "...") {
      setHornType(event.target.value);
      localStorage.setItem('hornType', event.target.value);
    }
  }

  return (
    <div>
      <label htmlFor="dropdown">What type of horn do you play?</label>
      <select id="hornTypeDropdown" value={hornType} onChange={handleHornTypeChange}>
        <option value="...">...</option>
        <option value="singleBb">Single Bb horn</option>
        <option value="standardDouble">Double horn</option>
      </select>  
    </div>
  );
};

export default Settings;
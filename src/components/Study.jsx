import React, { useEffect, useState } from "react";
import fingerings from '../data/fingeringChart.json'
import { LocalStorageKeys, HornTypes } from "../utils/GlobalKeys.js";

export const Study = () => {
  const [hornType, setHornType] = useState(localStorage.getItem(LocalStorageKeys.HORNTYPE));

  const getAlternates = (fList) => {
    return fList.map(fing => 
      <span className="row">{fing}</span>
    )
  }

  const FingeringChart = fingerings.map(note =>
    <div className="row study-row" key={fingerings.indexOf(note)}>
      <img className="column study-flashcard" src={note.img} />
      <span className={hornType == HornTypes.DOUBLEHORN ? "visible column study-fingerings" : "invisible column"}>{getAlternates(note.doubleFingerings)}</span>
      <span className={hornType == HornTypes.SINGLEBB ? "visible column study-fingerings" : "invisible column"}>{getAlternates(note.BbFingerings)}</span>
    </div>
  );

  // throw new Error("my error info")

  return (
    <>
    <h3>{hornType == HornTypes.DOUBLEHORN ? "Double Horn" : "Single Bb Horn"} Fingering Chart</h3>
    {FingeringChart}
    </>
  );
};

export default Study;
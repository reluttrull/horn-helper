import React, { useEffect, useState } from "react";
import fingerings from '../data/fingeringChart.json'
import { LocalStorageKeys, HornTypes, Ranges, AccidentalSettings } from "../utils/GlobalKeys.js";
import { oneOctave, twoOctaves, oneOctaveAccidentalsEasy, oneOctaveAccidentalsMost, 
  oneOctaveAccidentalsAll, twoOctavesAccidentalsEasy, twoOctavesAccidentalsMost, 
  twoOctavesAccidentalsAll } from '../utils/Structures.js';

export const Study = () => {
  const [hornType, setHornType] = useState(localStorage.getItem(LocalStorageKeys.HORNTYPE));
  const [range, setRange] = useState(localStorage.getItem(LocalStorageKeys.RANGE));
  const [useAccidentals, setUseAccidentals] = useState(localStorage.getItem(LocalStorageKeys.USEACCIDENTALS));

  const getAlternates = (fList) => {
    return fList.map(fing => 
      <span className="row">{fing}</span>
    )
  }

  const getMyAccidentals = () => {
    switch (range) {
      case Ranges.ONEOCTAVE:
        switch (useAccidentals) {
          case AccidentalSettings.EASY:
            return oneOctaveAccidentalsEasy;
          case AccidentalSettings.MOST:
            return oneOctaveAccidentalsMost;
          case AccidentalSettings.ALL:
            return oneOctaveAccidentalsAll;
          default:
            return [];
        }
        break;
      case Ranges.TWOOCTAVES:
        switch (useAccidentals) {
          case AccidentalSettings.EASY:
            return twoOctavesAccidentalsEasy;
          case AccidentalSettings.MOST:
            return twoOctavesAccidentalsMost;
          case AccidentalSettings.ALL:
            return twoOctavesAccidentalsAll;
          default:
            return [];
        }
    }
  }

  const getMyNotes = () => {
    let myRange = [];
    switch (range) {
      case Ranges.ONEOCTAVE:
        myRange = oneOctave.concat(getMyAccidentals());
        break;
      case Ranges.TWOOCTAVES:
        myRange = twoOctaves.concat(getMyAccidentals());
        break;
    }
    return fingerings.filter(f => myRange.includes(f.noteId));
  }

  const FingeringChart = getMyNotes().map(note =>
    <div className="row study-row" key={getMyNotes().indexOf(note)}>
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
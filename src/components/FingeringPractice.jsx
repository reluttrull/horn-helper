import React, { useEffect, useCallback, useState, useRef } from "react";
import { CountdownTimer } from './CountdownTimer.jsx';
import { LocalStorageKeys, Ranges, HornTypes, AccidentalSettings } from "../utils/GlobalKeys.js";
import { oneOctave, twoOctaves, oneOctaveAccidentalsEasy, oneOctaveAccidentalsMost, 
  oneOctaveAccidentalsAll, twoOctavesAccidentalsEasy, twoOctavesAccidentalsMost, 
  twoOctavesAccidentalsAll } from '../utils/Structures.js';
import { getScores } from "../utils/DataAccess.js";
import fingerings from '../data/fingeringChart.json';
import * as Tone from 'tone';
import { FaVolumeXmark, FaVolumeHigh } from 'react-icons/fa6';

export const FingeringPractice = () => {
  const [soundOn, setSoundOn] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timerRunning, setTimerRunning] = useState(null);
  const [score, setScore] = useState(0);
  const [initials, setInitials] = useState("");
  const [displayCard, setDisplayCard] = useState(0);
  let currentCard = useRef(0);
  // user settings
  const [hornType, setHornType] = useState(localStorage.getItem(LocalStorageKeys.HORNTYPE));
  const [range, setRange] = useState(localStorage.getItem(LocalStorageKeys.RANGE));
  const [useAccidentals, setUseAccidentals] = useState(localStorage.getItem(LocalStorageKeys.USEACCIDENTALS));

  // horn key ids
  const ButtonNames = {
    T: "buttonT",
    ONE: "button1",
    TWO: "button2", 
    THREE: "button3",
    O: "buttonO"
  }

  // check to see if the user already has down the combination for the next card
  // (if so, we'll skip this card, so they don't get free points)
  const alreadyHaveKeysDown = (keysDown, possibleNextFingerings) => {
    let i = 0;
    while (i < possibleNextFingerings.length) {
      if (possibleNextFingerings[i].split('').every(char => keysDown.includes(char))) {
        return true;
      }
      i++;
    }
    return false;
  };

  // handle keyboard shortcuts
  const handleKeyPress = useCallback((event) => {
    if (event.key == 'x') {
      handleButtonClickOn(ButtonNames.T);
    } else if (event.key == 'd') {
      handleButtonClickOn(ButtonNames.ONE);
    } else if (event.key == 'e') {
      handleButtonClickOn(ButtonNames.TWO);
    } else if (event.key == '3') {
      handleButtonClickOn(ButtonNames.THREE);
    } else if (event.key == 'o') {
      handleButtonClickOn(ButtonNames.O);
    } else if (event.key == 'c') {
      handleClear();
    }
  }, []);

  // handle keyboard shortcuts
  const handleKeyUp = useCallback((event) => {
    if (event.key == 'x') {
      handleButtonClickOff(ButtonNames.T);
    } else if (event.key == 'd') {
      handleButtonClickOff(ButtonNames.ONE);
    } else if (event.key == 'e') {
      handleButtonClickOff(ButtonNames.TWO);
    } else if (event.key == '3') {
      handleButtonClickOff(ButtonNames.THREE);
    } else if (event.key == 'o') {
      handleButtonClickOff(ButtonNames.O);
    } else if (event.key == 'c') {
      setButtonStates({
        buttonT: false,
        button1: false,
        button2: false,
        button3: false,
        buttonO: false
      });
    }
  }, []);

  // listen for keyboard shortcuts
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyUp]);

  //button logic
  const [buttonStates, setButtonStates] = useState({
    buttonT: false,
    button1: false,
    button2: false,
    button3: false,
    buttonO: false
  });

  // handle emergency clear all (probably don't need anymore)
  const handleClear = () => {
    setButtonStates({
      buttonT: false,
      button1: false,
      button2: false,
      button3: false,
      buttonO: false
    });
  }

  // set button states for just this button
  const handleButtonClickOn = (button) => {
    setButtonStates((prevState) => ({
      ...prevState,
      [button]: true,
    }));
  };

  const handleButtonClickOff = (button) => {
    setButtonStates((prevState) => ({
      ...prevState,
      [button]: false,
    }));
  };

  // returns this card's (i's) fingerings for user's horn type (ht)
  const getDefaultFingeringsForHornType = (i, ht) => {
    switch (ht) {
      case HornTypes.DOUBLEHORN:
        return fingerings[i].doubleFingerings;
      case HornTypes.SINGLEBB:
        return fingerings[i].BbFingerings;
      case HornTypes.SINGLEF:
        return fingerings[i].FFingerings;
      default:
        return null;
    }
  }

  // most of the time we get here, it's to handle correct answer and move on
  // need to refactor and split this up a bit
	const answerClick = (isCorrect, thisCombination) => {
    let oldcard = currentCard.current;
    // play audio of correct answer
    if (isCorrect && soundOn && fingerings[oldcard]) {
      const sampler = new Tone.Sampler({
        "Bb2" : "/samples/Bb2.mp3",
        "D3" : "/samples/D3.mp3",
        "F3" : "/samples/F3.mp3",
        "A3" : "/samples/A3.mp3",
        "C4" : "/samples/C4.mp3",
        "E4" : "/samples/E4.mp3",
        "G4" : "/samples/G4.mp3",
      }, function(){
        //sampler will repitch the closest sample
        console.log('ready and playing ' + fingerings[oldcard].soundingPitch);
        sampler.triggerAttackRelease(fingerings[oldcard].soundingPitch, "2n");
      }).toDestination();
    }
    //move on to next card
		currentCard.current = parseInt(Math.random() * fingerings.length);
    console.log(currentCard.current);
    // gather user's possible notes to draw from
    // probably need to pull this out and only perform once
    let baseNotes = range == Ranges.ONEOCTAVE ? oneOctave : twoOctaves;
    let myNotes = [];
    if (useAccidentals == AccidentalSettings.EASY) {
      myNotes = baseNotes.concat((range == Ranges.ONEOCTAVE ? oneOctaveAccidentalsEasy : twoOctavesAccidentalsEasy));
    } else if (useAccidentals == AccidentalSettings.MOST) {
      myNotes = baseNotes.concat((range == Ranges.ONEOCTAVE ? oneOctaveAccidentalsMost : twoOctavesAccidentalsMost));
    } else if (useAccidentals == AccidentalSettings.ALL) {
      myNotes = baseNotes.concat((range == Ranges.ONEOCTAVE ? oneOctaveAccidentalsAll : twoOctavesAccidentalsAll));
    } else {
      myNotes = Array.from(baseNotes);
    }

    // if card is not in my list, or this fingering contained in previous fingering:
    // move on to another random card
    while (!myNotes.includes(fingerings[currentCard.current].noteId) 
      || (thisCombination && alreadyHaveKeysDown(thisCombination, 
            getDefaultFingeringsForHornType(currentCard.current, hornType)[0]))) {
      currentCard.current = parseInt(Math.random() * fingerings.length);
    }
    // we got to a card that will work
    setDisplayCard(currentCard.current);
    //make changes based on selection
		if (isCorrect && timerRunning) {
			setScore(score + 1);
		}
	};

  // this runs constantly, checking if buttons pressed match target fingerings
  const checkCombination = () => {
    const { buttonT, button1, button2, button3, buttonO } = buttonStates;
    let combination = "";
    if (!buttonT && button1 && !button2 && !button3) {
      combination = "1";
    } else if (!buttonT && !button1 && button2 && !button3) {
      combination = "2";
    } else if (!buttonT && !button1 && !button2 && button3) {
      combination = "3";
    } else if (!buttonT && button1 && button2 && !button3) {
      combination = "12";
    } else if (!buttonT && !button1 && button2 && button3) {
      combination = "23";
    } else if (!buttonT && button1 && !button2 && button3) {
      combination = "13";
    } else if (!buttonT && button1 && button2 && button3) {
      combination = "123";
    } else if (buttonT && !button1 && !button2 && !button3) {
      combination = "T";
    } else if (buttonT && button1 && !button2 && !button3) {
      combination = "T1";
    } else if (buttonT && !button1 && button2 && !button3) {
      combination = "T2";
    } else if (buttonT && !button1 && !button2 && button3) {
      combination = "T3";
    } else if (buttonT && button1 && button2 && !button3) {
      combination = "T12";
    } else if (buttonT && !button1 && button2 && button3) {
      combination = "T23";
    } else if (buttonT && button1 && !button2 && button3) {
      combination = "T13";
    } else if (buttonT && button1 && button2 && button3) {
      combination = "T123";
    } else if (buttonO) {
      combination = "0";
    } else {
      combination = "nothing selected";
    }
    let noteFingerings = [];
    noteFingerings = getDefaultFingeringsForHornType(currentCard.current, hornType)[0];
    // if we got it right...
    if (noteFingerings.includes(combination)) answerClick(true, combination);
    // either way, return what we have down
    return combination;
  };

  // see if timer still running (triggered from CountdownTimer)
  const handleTimerData = (data) => {
    setTimerRunning(data);
    if (!data) {
      setGameOver(true);
    }
  }

  // validate initials input as typed
  const handleInitialsChange = (e) => {
    const regex = /^[a-zA-Z]{0,3}$/; // Allow only three alpha characters
    if (regex.test(e.target.value)) {
      setInitials(e.target.value);
    }
  };

  // save score data and reset game state
  const handleSaveInitials = () => {
    localStorage.setItem('score:'+initials+','+new Date(), score);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
  }
  // make sure user settings are up to date and start game
  const handleGameStart = () => {
    setHornType(localStorage.getItem(LocalStorageKeys.HORNTYPE));
    setRange(localStorage.getItem(LocalStorageKeys.RANGE));
    setUseAccidentals(localStorage.getItem(LocalStorageKeys.USEACCIDENTALS));
    setGameStarted(true);
  }

  useEffect(() => {
    if (getScores()[0]) {
      // populate initials based on most recent score, if present
      setInitials(getScores()[0].initials);
    };
		answerClick(false);
  }, []);

  return (
    <div>
      <div className="row">
        <div className="column">  
          <img className="flashcard" src={fingerings[displayCard].img} alt={fingerings[displayCard].noteId} />
        </div>
        <div className="column">
          <button id="volume-control" onClick={() => setSoundOn(!soundOn)}>{soundOn ? <FaVolumeHigh /> : <FaVolumeXmark />}</button>
          {gameStarted ? <CountdownTimer initialTime={60} onDataSend={handleTimerData} /> : <button onClick={() => handleGameStart()}>Start</button>}
          <h4 className="console-style">Score = {score}</h4>
        </div>
      </div>
      <div className={gameOver ? "visible" : "invisible"}>
        game over 
        <input
          type="text"
          value={initials}
          onChange={handleInitialsChange}
          placeholder="Enter up to three initials"
        />
        <button onClick={handleSaveInitials}>Save</button>
      </div>
      <div className={timerRunning ? "button-block visible" : "button blocks invisible"}>
        <div>
          <button className="key"
                  onMouseDown={() => handleButtonClickOn(ButtonNames.THREE)}
                  onTouchStart={() => handleButtonClickOn(ButtonNames.THREE)}
                  onMouseUp={() => handleButtonClickOff(ButtonNames.THREE)}
                  onTouchEnd={() => handleButtonClickOff(ButtonNames.THREE)}>
            3 (3)
          </button>
        </div>
        <div>
          <button className="key"
                  onMouseDown={() => handleButtonClickOn(ButtonNames.TWO)}
                  onTouchStart={() => handleButtonClickOn(ButtonNames.TWO)}
                  onMouseUp={() => handleButtonClickOff(ButtonNames.TWO)}
                  onTouchEnd={() => handleButtonClickOff(ButtonNames.TWO)}>
            2 (e)
          </button>
        </div>
        <div>
          <button className="key"
                  onMouseDown={() => handleButtonClickOn(ButtonNames.ONE)}
                  onTouchStart={() => handleButtonClickOn(ButtonNames.ONE)}
                  onMouseUp={() => handleButtonClickOff(ButtonNames.ONE)}
                  onTouchEnd={() => handleButtonClickOff(ButtonNames.ONE)}>
            1 (d)
          </button>
        </div>
        <div>
          <button className={hornType == HornTypes.DOUBLEHORN ? "key" : "invisible key"}
                  onMouseDown={() => handleButtonClickOn(ButtonNames.T)}
                  onTouchStart={() => handleButtonClickOn(ButtonNames.T)}
                  onMouseUp={() => handleButtonClickOff(ButtonNames.T)}
                  onTouchEnd={() => handleButtonClickOff(ButtonNames.T)}>
            T (x)
          </button>
          <button className="key"
                  onMouseDown={() => handleButtonClickOn(ButtonNames.O)}
                  onTouchStart={() => handleButtonClickOn(ButtonNames.O)}
                  onMouseUp={() => handleButtonClickOff(ButtonNames.O)}
                  onTouchEnd={() => handleButtonClickOff(ButtonNames.O)}>
            open (o)
          </button>
        </div>
      </div>
      <p className="invisible">{checkCombination()}</p>
    </div>
  );
};

export default FingeringPractice;

import React, { useEffect, useCallback, useState, useRef } from "react";
import { FaVolumeXmark, FaVolumeHigh } from 'react-icons/fa6';
import * as Tone from 'tone';
import { CountdownTimer } from './CountdownTimer.jsx';
import { LocalStorageKeys, Ranges, HornTypes, AccidentalSettings } from "../utils/GlobalKeys.js";
import { oneOctave, twoOctaves, oneOctaveAccidentalsEasy, oneOctaveAccidentalsMost, 
  oneOctaveAccidentalsAll, twoOctavesAccidentalsEasy, twoOctavesAccidentalsMost, 
  twoOctavesAccidentalsAll } from '../utils/Structures.js';
import { getScores } from "../utils/DataAccess.js";
import fingerings from '../data/fingeringChart.json';

export const FingeringPractice = () => {
  const [soundOn, setSoundOn] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [buttonMashing, setButtonMashing] = useState(false);
  const [timerRunning, setTimerRunning] = useState(null);
  const [score, setScore] = useState(0);
  const [initials, setInitials] = useState("");
  const [displayCard, setDisplayCard] = useState(0);
  let buttonMashingPenalty = false;
  let currentCard = useRef(0);
  let myNotes = [];
  // user settings
  const [hornType, setHornType] = useState(localStorage.getItem(LocalStorageKeys.HORNTYPE));
  const [range, setRange] = useState(localStorage.getItem(LocalStorageKeys.RANGE));
  const [useAccidentals, setUseAccidentals] = useState(localStorage.getItem(LocalStorageKeys.USEACCIDENTALS));

  // button names
  const ButtonNames = {
    T: "buttonT",
    ONE: "button1",
    TWO: "button2", 
    THREE: "button3",
    O: "buttonO"
  }
  
  //button states
  const [buttonStates, setButtonStates] = useState({
    buttonT: false,
    button1: false,
    button2: false,
    button3: false,
    buttonO: false
  });

  const audioSamples = {
        "Bb2" : "/horn-helper/samples/Bb2.mp3",
        "D3" : "/horn-helper/samples/D3.mp3",
        "F3" : "/horn-helper/samples/F3.mp3",
        "A3" : "/horn-helper/samples/A3.mp3",
        "C4" : "/horn-helper/samples/C4.mp3",
        "E4" : "/horn-helper/samples/E4.mp3",
        "G4" : "/horn-helper/samples/G4.mp3",
      };

  // check to see if the user already has down the combination for the next card
  // (if so, we'll skip this card, so they don't get free points)
  const alreadyHasKeysDown = (keysDown, possibleNextFingerings) => {
    let i = 0;
    while (i < possibleNextFingerings.length) {
      // if user has 12 down, we still want to skip next fingerings of 1 or 2
      if (possibleNextFingerings[i].split('').every(char => keysDown.includes(char))) {
        return true;
      }
      i++;
    }
    return false;
  };

  // handle keyboard shortcuts: on
  const handleKeyPress = useCallback((event) => {
    if (event.key == 'x') {
      handleButtonClick(ButtonNames.T, true);
    } else if (event.key == 'd') {
      handleButtonClick(ButtonNames.ONE, true);
    } else if (event.key == 'e') {
      handleButtonClick(ButtonNames.TWO, true);
    } else if (event.key == '3') {
      handleButtonClick(ButtonNames.THREE, true);
    } else if (event.key == 'o') {
      handleButtonClick(ButtonNames.O, true);
    } else if (event.key == 'c') {
      handleClear();
    }
  }, []);

  // handle keyboard shortcuts: off
  const handleKeyUp = useCallback((event) => {
    if (event.key == 'x') {
      handleButtonClick(ButtonNames.T, false);
    } else if (event.key == 'd') {
      handleButtonClick(ButtonNames.ONE, false);
    } else if (event.key == 'e') {
      handleButtonClick(ButtonNames.TWO, false);
    } else if (event.key == '3') {
      handleButtonClick(ButtonNames.THREE, false);
    } else if (event.key == 'o') {
      handleButtonClick(ButtonNames.O, false);
    } else if (event.key == 'c') {
      handleClear();
    }
  }, []);

  // listen for keyboard shortcuts: on
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // listen for keyboard shortcuts: off
  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyUp]);

  // handle emergency clear all (probably don't need anymore, keep for testing)
  const handleClear = () => {
    setButtonStates({
      buttonT: false,
      button1: false,
      button2: false,
      button3: false,
      buttonO: false
    });
  }

  let recentButtonClicks = [0,0,0,0,0,0,0,0,0,0];

  // set button states for just this button
  const handleButtonClick = (button, isOn) => {
    // always let buttons unclick
    if (!isOn) {
      setButtonStates((prevState) => ({
        ...prevState,
        [button]: false,
      }));
      return;
    }
    let millis = Date.now();
    recentButtonClicks = recentButtonClicks.slice(1).concat(millis);
    console.log(recentButtonClicks);
    if (millis - recentButtonClicks[0] < 800) {
      console.log("mashing!");
      // do something about button mashing
      buttonMashingPenalty = true;
      setButtonMashing(true);
      setTimeout(() => {
        buttonMashingPenalty = false;
        setButtonMashing(false); // reenable after 2 second penalty
      }, 2000)
    } else {
      if (!buttonMashingPenalty) {
        // if not button mashing, we're ok to click button
        setButtonStates((prevState) => ({
          ...prevState,
          [button]: true,
        }));
      }
    }
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

  const updateMyNotes = () => {
    let baseNotes = range == Ranges.ONEOCTAVE ? oneOctave : twoOctaves;
    if (useAccidentals == AccidentalSettings.EASY) {
      myNotes = baseNotes.concat((range == Ranges.ONEOCTAVE ? oneOctaveAccidentalsEasy : twoOctavesAccidentalsEasy));
    } else if (useAccidentals == AccidentalSettings.MOST) {
      myNotes = baseNotes.concat((range == Ranges.ONEOCTAVE ? oneOctaveAccidentalsMost : twoOctavesAccidentalsMost));
    } else if (useAccidentals == AccidentalSettings.ALL) {
      myNotes = baseNotes.concat((range == Ranges.ONEOCTAVE ? oneOctaveAccidentalsAll : twoOctavesAccidentalsAll));
    } else {
      myNotes = Array.from(baseNotes);
    }
  }

  useEffect(() => {
    updateMyNotes();
  }, [range, useAccidentals]);

  // most of the time we get here, it's to handle correct answer and move on
	const answerClick = (isCorrect, thisCombination) => {
    let oldcard = currentCard.current;
    // play audio of correct answer
    if (isCorrect && soundOn && fingerings[oldcard]) {
      const sampler = new Tone.Sampler(audioSamples, function(){
        //sampler will repitch the closest sample
        sampler.triggerAttackRelease(fingerings[oldcard].soundingPitch, "2n");
      }).toDestination();
    }
    //move on to next card
		currentCard.current = parseInt(Math.random() * fingerings.length);
    console.log(currentCard.current);
    console.log(myNotes);
    // gather user's possible notes to draw from
    // only update if empty for some reason
    if (myNotes.length < 1) updateMyNotes();

    // if card is not in my list, or this fingering contained in previous fingering:
    // move on to another random card
    while (!myNotes.includes(fingerings[currentCard.current].noteId) 
      || (thisCombination && alreadyHasKeysDown(thisCombination, 
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

  // this updates constantly, checking if buttons pressed match target fingerings
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
    noteFingerings = getDefaultFingeringsForHornType(currentCard.current, hornType);
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
    Tone.start();
  }

  useEffect(() => {
    if (getScores()[0]) {
      // populate initials based on most recent score, if present
      setInitials(getScores()[0].initials);
    };
    // make sure first card is different each time
		answerClick(false);
  }, []);

  return (
    <div>
      <div className="row">
        <div className="column">  
          <img className="flashcard" src={"/horn-helper" + fingerings[displayCard].img} alt={fingerings[displayCard].noteId} />
        </div>
        <div className="column score-column">
          <button id="volume-control" onClick={() => setSoundOn(!soundOn)}>{soundOn ? <FaVolumeHigh /> : <FaVolumeXmark />}</button>
          {gameStarted ? <CountdownTimer initialTime={60} onDataSend={handleTimerData} /> : <button onClick={() => handleGameStart()}>Start</button>}
          {buttonMashing ? <span className="warning">no button mashing!</span> : <h5 className="console-style">Score = {score}</h5>}
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
      <div className={timerRunning ? "button-block visible" : "button-block invisible"}>
        <div>
          <button className="key"
                  onMouseDown={() => handleButtonClick(ButtonNames.THREE, true)}
                  onTouchStart={() => handleButtonClick(ButtonNames.THREE, true)}
                  onMouseUp={() => handleButtonClick(ButtonNames.THREE, false)}
                  onTouchEnd={() => handleButtonClick(ButtonNames.THREE, false)}>
            3 (3)
          </button>
        </div>
        <div>
          <button className="key"
                  onMouseDown={() => handleButtonClick(ButtonNames.TWO, true)}
                  onTouchStart={() => handleButtonClick(ButtonNames.TWO, true)}
                  onMouseUp={() => handleButtonClick(ButtonNames.TWO, false)}
                  onTouchEnd={() => handleButtonClick(ButtonNames.TWO, false)}>
            2 (e)
          </button>
        </div>
        <div>
          <button className="key"
                  onMouseDown={() => handleButtonClick(ButtonNames.ONE, true)}
                  onTouchStart={() => handleButtonClick(ButtonNames.ONE, true)}
                  onMouseUp={() => handleButtonClick(ButtonNames.ONE, false)}
                  onTouchEnd={() => handleButtonClick(ButtonNames.ONE, false)}>
            1 (d)
          </button>
        </div>
        <div className="row">
          <div className="column">
            <button className={hornType == HornTypes.DOUBLEHORN ? "key" : "invisible key"}
                    onMouseDown={() => handleButtonClick(ButtonNames.T, true)}
                    onTouchStart={() => handleButtonClick(ButtonNames.T, true)}
                    onMouseUp={() => handleButtonClick(ButtonNames.T, false)}
                    onTouchEnd={() => handleButtonClick(ButtonNames.T, false)}>
              T (x)
            </button>
          </div>
          <div className="column">
            <button className="key"
                    onMouseDown={() => handleButtonClick(ButtonNames.O, true)}
                    onTouchStart={() => handleButtonClick(ButtonNames.O, true)}
                    onMouseUp={() => handleButtonClick(ButtonNames.O, false)}
                    onTouchEnd={() => handleButtonClick(ButtonNames.O, false)}>
              open (o)
            </button>
          </div>
        </div>
      </div>
      <p className="invisible">{checkCombination()}</p>
    </div>
  );
};

export default FingeringPractice;

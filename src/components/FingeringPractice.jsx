import React, { useEffect, useCallback, useState, useRef } from "react";
import { CountdownTimer } from './CountdownTimer.jsx';
import { LocalStorageKeys } from "../utils/GlobalKeys.js";
import { oneOctave, twoOctaves, oneOctaveAccidentalsEasy, oneOctaveAccidentalsMost, 
  oneOctaveAccidentalsAll, twoOctavesAccidentalsEasy, twoOctavesAccidentalsMost, 
  twoOctavesAccidentalsAll } from '../utils/Structures.js';
import fingerings from '../data/fingeringChart.json';

export const FingeringPractice = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [initials, setInitials] = useState("");
  const [displayCard, setDisplayCard] = useState(0);
  let currentCard = useRef(0);
  const [timerRunning, setTimerRunning] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [hornType, setHornType] = useState(localStorage.getItem(LocalStorageKeys.HORNTYPE));
  const [range, setRange] = useState(localStorage.getItem(LocalStorageKeys.RANGE));
  const [useAccidentals, setUseAccidentals] = useState(localStorage.getItem(LocalStorageKeys.USEACCIDENTALS));
  const ButtonNames = {
    T: "buttonT",
    ONE: "button1",
    TWO: "button2", 
    THREE: "button3",
    O: "buttonO"
  }

  const containsAllCharacters = (str1, str2) => {
    return str2.split('').every(char => str1.includes(char));
  };

  //shortcuts
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

  const handleClear = () => {
    setButtonStates({
      buttonT: false,
      button1: false,
      button2: false,
      button3: false,
      buttonO: false
    });
  }

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


	const answerClick = (isCorrect, thisCombination) => {
    //move on
		currentCard.current = parseInt(Math.random() * fingerings.length);
    console.log(currentCard.current);
    let baseNotes = range == '1octave' ? oneOctave : twoOctaves;
    let myNotes = [];
    if (useAccidentals == 'easy') {
      myNotes = baseNotes.concat((range == '1octave' ? oneOctaveAccidentalsEasy : twoOctavesAccidentalsEasy));
    } else if (useAccidentals == 'most') {
      myNotes = baseNotes.concat((range == '1octave' ? oneOctaveAccidentalsMost : twoOctavesAccidentalsMost));
    } else if (useAccidentals == 'all') {
      myNotes = baseNotes.concat((range == '1octave' ? oneOctaveAccidentalsAll : twoOctavesAccidentalsAll));
    } else {
      myNotes = Array.from(baseNotes);
    }
    // not in my list, or this fingering contained in previous fingering
    while (!myNotes.includes(fingerings[currentCard.current].noteId) 
      || (thisCombination && containsAllCharacters(thisCombination, (hornType == 'standardDouble' 
                ? fingerings[currentCard.current].doubleFingering 
                : fingerings[currentCard.current].BbFingering)))) {
      currentCard.current = parseInt(Math.random() * fingerings.length);
    }
    // if (myNotes.includes(fingerings[currentCard.current].noteId)) {
    //   console.log('contains ' + fingerings[currentCard.current].noteId);
    // }
    setDisplayCard(currentCard.current);
    //make changes based on selection
		if (isCorrect && timerRunning) {
			setScore(score + 1);
		}
    else {
      setScore(score);
    }     
	};

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
    let defaultFingering = "";
    //console.log('horn type is ' + hornType);
    switch (hornType) {
      case "singleBb":
        defaultFingering = fingerings[currentCard.current].BbFingering;
        break;
      case "standardDouble":
        defaultFingering = fingerings[currentCard.current].doubleFingering;
        break;
    }
    //console.log(fingerings[currentCard.current]);
    if (combination == defaultFingering) answerClick(true, combination);
    return combination;
  };

  const handleTimerData = (data) => {
    setTimerRunning(data);
    if (!data) {
      setGameOver(true);
    }
  }

  const handleInitialsChange = (e) => {
    const regex = /^[a-zA-Z]{1,3}$/; // Allow only three alpha characters
    if (regex.test(e.target.value)) {
      setInitials(e.target.value);
      console.log('set to ' + initials);
    }
  };

  const handleSaveInitials = () => {
    console.log('initials saved as ' + initials);
    localStorage.setItem('score:'+initials+','+new Date(), score);
    setScore(0);
    setGameOver(false);
    setGameStarted(false);
  }

  useEffect(() => {
		answerClick(false);
  }, []);

  return (
    <div>
      <div className="row">
        <div className="column">  
          <img className="flashcard" src={fingerings[displayCard].img} alt={fingerings[displayCard].noteId} />
        </div>
        <div className="column">
          {gameStarted ? <CountdownTimer initialTime={60} onDataSend={handleTimerData} /> : <button onClick={() => setGameStarted(true)}>Start</button>}
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
          <button className={hornType == 'standardDouble' ? "key" : "invisible key"}
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

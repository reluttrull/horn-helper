import React, { useEffect, useCallback, useState, useRef } from "react";
import { CountdownTimer } from './CountdownTimer.jsx';
import fingerings from '../data/fingeringChart.json';

export const FingeringPractice = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [initials, setInitials] = useState("");
  const [displayCard, setDisplayCard] = useState(0);
  let currentCard = useRef(0);
  const [timerRunning, setTimerRunning] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [hornType, setHornType] = useState(localStorage.getItem('hornType'));
  const [range, setRange] = useState(localStorage.getItem('range'));
  const [useAccidentals, setUseAccidentals] = useState(localStorage.getItem('accidentals'));
  let oneOctave = ['c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4', 'c5'];
  let twoOctaves = ['f3', 'g3', 'a3', 'b3', 'c4', 'd4', 'e4', 'f4', 'g4', 'a4', 'b4', 'c5', 'd5', 'e5', 'f5'];
  let oneOctaveAccidentalsEasy = ['ef4', 'fs4', 'bf4'];
  let oneOctaveAccidentalsMost = ['cs4', 'df4', 'ds4', 'ef4', 'fs4', 'gf4', 'gs4', 'af4', 'as4', 'bf4'];
  let oneOctaveAccidentalsAll = ['cs4', 'df4', 'ds4', 'ef4', 'ff4', 'es4', 'fs4', 'gf4', 'gs4', 'af4', 'as4', 'bf4', 'cf5', 'bs4'];
  let twoOctavesAccidentalsEasy = ['fs3', 'bf3', 'ef4', 'fs4', 'bf4', 'ef5'];
  let twoOctavesAccidentalsMost = ['fs3', 'gf3', 'gs3', 'af3', 'as3', 'bf3', 'cs4', 'df4', 'ds4', 'ef4', 'fs4', 'gf4', 'gs4', 'af4', 'as4', 'bf4', 'cs5', 'df5', 'ds5', 'ef5'];
  let twoOctavesAccidentalsAll = ['fs3', 'gf3', 'gs3', 'af3', 'as3', 'bf3', 'cf4', 'bs3', 'cs4', 'df4', 'ds4', 'ef4', 'ff4', 'es4', 'fs4', 'gf4', 'gs4', 'af4', 'as4', 'bf4', 'cf5', 'bs4', 'cs5', 'df5', 'ds5', 'ef5', 'ff5', 'es5'];

  //shortcuts
  const handleKeyPress = useCallback((event) => {
    if (event.key == 'x') {
      handleButtonClickOn("buttonT");
    } else if (event.key == 'd') {
      handleButtonClickOn("button1");
    } else if (event.key == 'e') {
      handleButtonClickOn("button2");
    } else if (event.key == '3') {
      handleButtonClickOn("button3");
    } else if (event.key == 'o') {
      handleButtonClickOn("buttonO");
    } else if (event.key == 'c') {
      handleClear();
    }
  }, []);

  const handleKeyUp = useCallback((event) => {
    if (event.key == 'x') {
      handleButtonClickOff("buttonT");
    } else if (event.key == 'd') {
      handleButtonClickOff("button1");
    } else if (event.key == 'e') {
      handleButtonClickOff("button2");
    } else if (event.key == '3') {
      handleButtonClickOff("button3");
    } else if (event.key == 'o') {
      handleButtonClickOff("buttonO");
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
    //console.log('my notes:');
    //console.log(myNotes);
    //console.log('json:');
    //console.log(fingerings);
    // not in my list, or matches previous fingering
    while (!myNotes.includes(fingerings[currentCard.current].noteId) 
      || (thisCombination && thisCombination.includes(hornType == 'standardDouble' ? fingerings[currentCard.current].doubleFingering : fingerings[currentCard.current].BbFingering))) {  
      currentCard.current = parseInt(Math.random() * fingerings.length);
      //console.log(fingerings[currentCard.current].noteId);
    }
    if (myNotes.includes(fingerings[currentCard.current].noteId)) {
      //console.log(range);
      console.log('contains ' + fingerings[currentCard.current].noteId);  
      console.log(new Date().toTimeString());
    }
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
      combination = "T0";
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
                  onMouseDown={() => handleButtonClickOn("button3")}
                  onTouchStart={() => handleButtonClickOn("button3")}
                  onMouseUp={() => handleButtonClickOff("button3")}
                  onTouchEnd={() => handleButtonClickOff("button3")}>
            3 (3)
            {/* {buttonStates.button3 ? "ON" : "OFF"} */}
          </button>
        </div>
        <div>
          <button className="key"
                  onMouseDown={() => handleButtonClickOn("button2")}
                  onTouchStart={() => handleButtonClickOn("button2")}
                  onMouseUp={() => handleButtonClickOff("button2")}
                  onTouchEnd={() => handleButtonClickOff("button2")}>
            2 (e)
          </button>
        </div>
        <div>
          <button className="key"
                  onMouseDown={() => handleButtonClickOn("button1")}
                  onTouchStart={() => handleButtonClickOn("button1")}
                  onMouseUp={() => handleButtonClickOff("button1")}
                  onTouchEnd={() => handleButtonClickOff("button1")}>
            1 (d)
          </button>
        </div>
        <div>
          <button className={hornType == 'standardDouble' ? "key" : "invisible key"}
                  onMouseDown={() => handleButtonClickOn("buttonT")}
                  onTouchStart={() => handleButtonClickOn("buttonT")}
                  onMouseUp={() => handleButtonClickOff("buttonT")}
                  onTouchEnd={() => handleButtonClickOff("buttonT")}>
            T (x)
          </button>
          <button className="key"
                  onMouseDown={() => handleButtonClickOn("buttonO")}
                  onTouchStart={() => handleButtonClickOn("buttonO")}
                  onMouseUp={() => handleButtonClickOff("buttonO")}
                  onTouchEnd={() => handleButtonClickOff("buttonO")}>
            open (o)
          </button>
        </div>
      </div>
      <p className="invisible">{checkCombination()}</p>
    </div>
  );
};

export default FingeringPractice;

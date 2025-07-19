import React, { useEffect, useCallback, useState, useRef } from "react";
import { CountdownTimer } from './CountdownTimer.jsx';
import fingerings from '../data/fingeringChart.json';

export const FingeringPractice = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [displayCard, setDisplayCard] = useState(0);
  let currentCard = useRef(0);

  //shortcuts
  const handleKeyPress = useCallback((event) => {
    if (event.key == ' ') {
      handleButtonClickOn("buttonT");
    } else if (event.key == 'b') {
      handleButtonClickOn("button1");
    } else if (event.key == 'h') {
      handleButtonClickOn("button2");
    } else if (event.key == 'y') {
      handleButtonClickOn("button3");
    } else if (event.key == 'o') {
      handleButtonClickOn("buttonO");
    } else if (event.key == 'c') {
      handleClear();
    }
  }, []);

  const handleKeyUp = useCallback((event) => {
    if (event.key == ' ') {
      handleButtonClickOff("buttonT");
    } else if (event.key == 'b') {
      handleButtonClickOff("button1");
    } else if (event.key == 'h') {
      handleButtonClickOff("button2");
    } else if (event.key == 'y') {
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


	const answerClick = (isCorrect) => {
    //move on
		currentCard.current = parseInt(Math.random() * fingerings.length);
    console.log(currentCard.current);
    setDisplayCard(currentCard.current);
    //make changes based on selection
		if (isCorrect) {
			setScore(score + 1);
		}
    else {
      setScore(score - 1);
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
    if (combination == fingerings[currentCard.current].defaultFingering) answerClick(true);
    return combination;
  };

  useEffect(() => {
		currentCard.current = parseInt(Math.random() * fingerings.length);
    setDisplayCard(currentCard.current);
  }, []);

  return (
    <div>
      <div>
        {gameStarted ? <CountdownTimer initialTime={60} /> : <button onClick={() => setGameStarted(true)}>Start</button>}
        <h4>Current score = {score}</h4>
      </div>
      <div>
        <img className="flashcard" src={fingerings[displayCard].img} alt={fingerings[displayCard].noteId} />
      </div>
      <p>'o' for all open, 'c' for clear</p>
      <div>
        <button onMouseDown={() => handleButtonClickOn("button3")}
                onTouchStart={() => handleButtonClickOn("button3")}
                onMouseUp={() => handleButtonClickOff("button3")}
                onTouchEnd={() => handleButtonClickOff("button3")}>
          3rd valve (y) {buttonStates.button3 ? "ON" : "OFF"}
        </button>
      </div>
      <div>
        <button onMouseDown={() => handleButtonClickOn("button2")}
                onTouchStart={() => handleButtonClickOn("button2")}
                onMouseUp={() => handleButtonClickOff("button2")}
                onTouchEnd={() => handleButtonClickOff("button2")}>
          2nd valve (h) {buttonStates.button2 ? "ON" : "OFF"}
        </button>
      </div>
      <div>
        <button onMouseDown={() => handleButtonClickOn("button1")}
                onTouchStart={() => handleButtonClickOn("button1")}
                onMouseUp={() => handleButtonClickOff("button1")}
                onTouchEnd={() => handleButtonClickOff("button1")}>
          1st valve (b) {buttonStates.button1 ? "ON" : "OFF"}
        </button>
      </div>
      <div>
        <button onMouseDown={() => handleButtonClickOn("buttonT")}
                onTouchStart={() => handleButtonClickOn("buttonT")}
                onMouseUp={() => handleButtonClickOff("buttonT")}
                onTouchEnd={() => handleButtonClickOff("buttonT")}>
          trigger (spacebar) {buttonStates.buttonT ? "ON" : "OFF"}
        </button>
        <button onMouseDown={() => handleButtonClickOn("buttonO")}
                onTouchStart={() => handleButtonClickOn("buttonO")}
                onMouseUp={() => handleButtonClickOff("buttonO")}
                onTouchEnd={() => handleButtonClickOff("buttonO")}>
          open (o) {buttonStates.buttonO ? "ON" : "OFF"}
        </button>
        <button onMouseDown={() => handleClear()}
                onTouchStart={() => handleClear()}>
          clear (c)
        </button>
      </div>
      <p>{checkCombination()}</p>
    </div>
  );
};

export default FingeringPractice;

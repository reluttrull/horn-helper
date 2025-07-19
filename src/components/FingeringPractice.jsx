import React, { useEffect, useCallback, useState } from "react";
import fingerings from '../data/fingeringChart.json';

export const FingeringPractice = () => {
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
      setButtonStates({
        buttonT: false,
        button1: false,
        button2: false,
        button3: false,
        buttonO: false
      });
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

  const checkCombination = () => {
    const { buttonT, button1, button2, button3, buttonO } = buttonStates;
    if (!buttonT && button1 && !button2 && !button3) {
      return "1";
    } else if (!buttonT && !button1 && button2 && !button3) {
      return "2";
    } else if (!buttonT && !button1 && !button2 && button3) {
      return "3";
    } else if (!buttonT && button1 && button2 && !button3) {
      return "12";
    } else if (!buttonT && !button1 && button2 && button3) {
      return "23";
    } else if (!buttonT && button1 && !button2 && button3) {
      return "13";
    } else if (!buttonT && button1 && button2 && button3) {
      return "123";
    } else if (buttonT && !button1 && !button2 && !button3) {
      return "T0";
    } else if (buttonT && button1 && !button2 && !button3) {
      return "T1";
    } else if (buttonT && !button1 && button2 && !button3) {
      return "T2";
    } else if (buttonT && !button1 && !button2 && button3) {
      return "T3";
    } else if (buttonT && button1 && button2 && !button3) {
      return "T12";
    } else if (buttonT && !button1 && button2 && button3) {
      return "T23";
    } else if (buttonT && button1 && !button2 && button3) {
      return "T13";
    } else if (buttonT && button1 && button2 && button3) {
      return "T123";
    } else if (buttonO) {
      return "0";
    } else {
      return "nothing selected";
    }
  };

  return (
    <div>
      <div>
        <img className="flashcard" src={fingerings[0].img} alt={fingerings[0].noteId} />
      </div>
      <div>
        <button onClick={() => handleButtonClickOn("button3")}>
          Button 3 {buttonStates.button3 ? "ON" : "OFF"}
        </button>
      </div>
      <div>
        <button onClick={() => handleButtonClickOn("button2")}>
          Button 2 {buttonStates.button2 ? "ON" : "OFF"}
        </button>
      </div>
      <div>
        <button onClick={() => handleButtonClickOn("button1")}>
          Button 1 {buttonStates.button1 ? "ON" : "OFF"}
        </button>
      </div>
      <div>
        <button onClick={() => handleButtonClickOn("buttont")}>
          Button T {buttonStates.buttonT ? "ON" : "OFF"}
        </button>
      </div>
      <p>{checkCombination()}</p>
      <p>{checkCombination() == fingerings[0].defaultFingering ? "Got it!" : "Not quite"}</p>
    </div>
  );
};

export default FingeringPractice;

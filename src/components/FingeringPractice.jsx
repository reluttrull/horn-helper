import React, { useEffect, useCallback, useState } from "react";

export const FingeringPractice = () => {
  //shortcuts
  const handleKeyPress = useCallback((event) => {
    if (event.key == ' ') {
      handleButtonClick("buttonT");
    } else if (event.key == 'b') {
      handleButtonClick("button1");
    } else if (event.key == 'h') {
      handleButtonClick("button2");
    } else if (event.key == 'y') {
      handleButtonClick("button3");
    } else if (event.key == 'o') {
      handleButtonClick("buttonO");
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
    document.addEventListener('keyup', handleKeyPress);
    return () => {
      document.removeEventListener('keyup', handleKeyPress);
    };
  }, [handleKeyPress]);

  //button logic
  const [buttonStates, setButtonStates] = useState({
    buttonT: false,
    button1: false,
    button2: false,
    button3: false,
    buttonO: false
  });

  const handleButtonClick = (button) => {
    setButtonStates((prevState) => ({
      ...prevState,
      [button]: !prevState[button],
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
      return "open";
    } else {
      return "nothing selected";
    }
  };

  return (
    <div>
      <div>
        <button onClick={() => handleButtonClick("button3")}>
          Button 3 {buttonStates.button3 ? "ON" : "OFF"}
        </button>
      </div>
      <div>
        <button onClick={() => handleButtonClick("button2")}>
          Button 2 {buttonStates.button2 ? "ON" : "OFF"}
        </button>
      </div>
      <div>
        <button onClick={() => handleButtonClick("button1")}>
          Button 1 {buttonStates.button1 ? "ON" : "OFF"}
        </button>
      </div>
      <div>
        <button onClick={() => handleButtonClick("buttont")}>
          Button T {buttonStates.buttonT ? "ON" : "OFF"}
        </button>
      </div>
      <p>{checkCombination()}</p>
    </div>
  );
};

export default FingeringPractice;

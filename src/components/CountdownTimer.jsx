import React, { useState, useEffect } from "react";

export const CountdownTimer = ({ initialTime, onDataSend }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    sendRunning(true);
    if (timeLeft <= 0) {
      sendRunning(false);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const sendRunning = (isRunning) => {
    onDataSend(isRunning);
  }

  return (
    <div>
      <h3>Time Left: {timeLeft}s</h3>
    </div>
  );
};

export default CountdownTimer;

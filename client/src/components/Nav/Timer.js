import React, { useState, useEffect } from 'react';
import '../styles/Timer.css'; // Make sure the path is correct

const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [inputTime, setInputTime] = useState('');
  const [beep] = useState(new Audio('/beep-sound.mp3')); // Ensure the beep sound file is in the public directory

  useEffect(() => {
    let interval = null;
    if (isActive) {
      if (seconds > 0) {
        interval = setInterval(() => {
          setSeconds(prev => prev - 1);
        }, 1000);
      } else {
        setIsActive(false);
        beep.play(); // Play the beep sound when the timer reaches zero
      }
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds, beep]);

  const startTimer = () => {
    if (inputTime > 0) {
      setSeconds(parseInt(inputTime, 10));
      setIsActive(true);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
    setInputTime('');
  };

  return (
    <div className="timer-container">
      <h1>Pomodoro Timer</h1>
      <div className="timer-display">
        {`${Math.floor(seconds / 3600)
          .toString()
          .padStart(2, '0')}:${Math.floor((seconds % 3600) / 60)
          .toString()
          .padStart(2, '0')}:${(seconds % 60)
          .toString()
          .padStart(2, '0')}`}
      </div>
      <input
        type="number"
        value={inputTime}
        onChange={(e) => setInputTime(e.target.value)}
        placeholder="Enter time in seconds"
        min="1"
      />
      <button onClick={startTimer}>Start</button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
};

export default Timer;

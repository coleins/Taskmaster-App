import React, { useState, useEffect } from 'react';
import '../styles/Timer.css';
import NavBar from './NavBar';
import SideBar from './SideBar';

const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [secondsInput, setSecondsInput] = useState(0);
  const [beep] = useState(new Audio('/beep-sound.mp3')); // Ensure the beep sound file is in the public directory

  useEffect(() => {
    let interval = null;
    if (isActive) {
      if (seconds > 0) {
        interval = setInterval(() => {
          setSeconds((prev) => prev - 1);
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
    const totalSeconds =
      parseInt(hours, 10) * 3600 +
      parseInt(minutes, 10) * 60 +
      parseInt(secondsInput, 10);

    if (totalSeconds > 0) {
      setSeconds(totalSeconds);
      setIsActive(true);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    setSeconds(0);
    setHours(0);
    setMinutes(0);
    setSecondsInput(0);
  };

  return (
    <div className="timer-container">
      <NavBar />
      <SideBar />
      <h1>Timer</h1>
      <div className="timer-display">
        {`${Math.floor(seconds / 3600)
          .toString()
          .padStart(2, '0')}:${Math.floor((seconds % 3600) / 60)
          .toString()
          .padStart(2, '0')}:${(seconds % 60)
          .toString()
          .padStart(2, '0')}`}
      </div>

      <div className="time-inputs">
        <div className="time-input">
          <label>Hours:</label>
          <select value={hours} onChange={(e) => setHours(e.target.value)}>
            {[...Array(24).keys()].map((hour) => (
              <option key={hour} value={hour}>
                {hour.toString().padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>

        <div className="time-input">
          <label>Minutes:</label>
          <select value={minutes} onChange={(e) => setMinutes(e.target.value)}>
            {[...Array(60).keys()].map((minute) => (
              <option key={minute} value={minute}>
                {minute.toString().padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>

        <div className="time-input">
          <label>Seconds:</label>
          <select
            value={secondsInput}
            onChange={(e) => setSecondsInput(e.target.value)}
          >
            {[...Array(60).keys()].map((second) => (
              <option key={second} value={second}>
                {second.toString().padStart(2, '0')}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button onClick={startTimer}>Start</button>
      <button onClick={resetTimer}>Reset</button>
    </div>
  );
};

export default Timer;

import React, { useState, useEffect } from 'react';
import './clock.css'; 

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date());
    }, 1000); // Update time every second

    return () => clearInterval(intervalId);
  }, []);

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');  
    return `${hours}:${minutes}`
  };

  return (
    <div className="clock">
      {formatTime(time)}
    </div>
  );
};

export default Clock;

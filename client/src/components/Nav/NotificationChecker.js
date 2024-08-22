// NotificationChecker.js
import React, { useState, useEffect } from 'react';
import { api } from "../../utils/api";
const NotificationChecker = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const checkNotifications = async () => {
      try {
        const response = await api.fetch('/check-tasks-due', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setNotifications(data); // Store notifications in state
      } catch (error) {
        console.error('Error checking notifications:', error);
      }
    };

    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    const interval = setInterval(checkNotifications, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {notifications.length > 0 ? (
        <ul>
          {notifications.map((message, index) => (
            <li key={index} className="notification-item">{message}</li>
          ))}
        </ul>
      ) : (
        <p>No notifications</p>
      )}
    </div>
  );
};

export default NotificationChecker;

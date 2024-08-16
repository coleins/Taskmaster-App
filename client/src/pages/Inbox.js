import React, { useState } from 'react';
import '../components/styles/Inbox.css';
import SideBar from '../components/Nav/SideBar';
import NavBar from '../components/Nav/NavBar';

const Inbox = () => {
  const [messages] = useState([
    { id: 1, sender: 'Emmanuel', content: 'Hey, just checking in on the project status.' },
    { id: 2, sender: 'nathan', content: 'Can you share the latest report?' },
    { id: 3, sender: 'Hezron', content: 'Let’s have a meeting tomorrow to discuss the next steps.' },
  ]);

  return (
    <>
    <NavBar/>
    <SideBar/>
    <div className="inbox-container">
      <h1>Inbox</h1>
      <div className="messages-container">
        {messages.map((message) => (
          <div key={message.id} className="message-card">
            <p><strong>{message.sender}</strong></p>
            <p>{message.content}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default Inbox;

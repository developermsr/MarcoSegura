// ChatBox.js
import React, { useState, useEffect } from 'react';
import MessageList from './MessageList'; // Asumiendo que tienes este componente
import './ChatBox.css'; // Asume que tienes un archivo CSS para estilizar tu ChatBox
import axios from 'axios';

const ChatBox = ({ messages, setMessages, sendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
 
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage); // Usa directamente la función que se pasó como prop.
      setNewMessage('');
    }
  };

  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };
  useEffect(() => {
    axios.get('https://marco-segura.vercel.app/api/messages')
      .then(response => {
        setMessages(response.data);
      })
      .catch(error => console.error('Error fetching messages:', error));
  }, [setMessages]); // Pasa setMessages para asegurarte de que no cambie y no provoque bucles infinitos.
  

  return (
    <div className="container-padre">
      <div className="chat-container">
        <div id="chat-box" className="messages-container">
          <MessageList messages={messages} />
        </div>
        <div className="input-container">
          <input
            type="text"
            value={newMessage}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="message-input"
            placeholder="Escribe un mensaje..."
          />
          <button onClick={handleSendMessage} className="send-button">
            Enviara
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;

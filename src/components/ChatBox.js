// ChatBox.js
import React, { useState, useEffect } from 'react';
import MessageList from './MessageList'; // Asumiendo que tienes este componente
import './ChatBox.css'; // Asume que tienes un archivo CSS para estilizar tu ChatBox
import axios from 'axios';
import io from 'socket.io-client';

const ChatBox = ({ messages, setMessages, sendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const socket = io('https://marco-segura.vercel.app/api/message'); // Reemplaza con la URL de tu servidor WebSocket

  // Maneja la recepción de nuevos mensajes desde el servidor WebSocket
 

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
    socket.on('message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      socket.disconnect();
    },
    axios.get('https://marco-segura.vercel.app/api/messages')
      .then(response => {
        setMessages(response.data);
      })
      .catch(error => console.error('Error fetching messages:', error));
  }, [setMessages,socket]); // Pasa setMessages para asegurarte de que no cambie y no provoque bucles infinitos.
  

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

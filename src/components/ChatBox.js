import React, { useState, useEffect } from 'react';
import MessageList from './MessageList';
import './ChatBox.css';
import axios from 'axios';

const ChatBox = ({ messages, setMessages, sendMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const [lastPollTime, setLastPollTime] = useState(new Date(0));

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      sendMessage(newMessage);
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
    const fetchNewMessages = async () => {
      try {
        const response = await axios.get(`https://marco-segura-8qpb.vercel.app/api/new-messages/${lastPollTime.toISOString()}`);
        const newMessages = response.data;
        if (newMessages.length > 0) {
          setMessages((prevMessages) => [...prevMessages, ...newMessages]);
          setLastPollTime(new Date());
        }
      } catch (error) {
        console.error('Error fetching new messages:', error);
      }
    };
    fetchNewMessages();
    const pollingInterval = setInterval(fetchNewMessages, 1000); // Puedes ajustar el intervalo según tus necesidades.
    return () => {
      clearInterval(pollingInterval);
    };
  }, [setMessages, lastPollTime, messages]);

  useEffect(() => {
    let watermark = lastPollTime; // Inicialmente, la marca de agua es el último tiempo de sondeo.
  
    const fetchNewMessages = async () => {
      try {
        const response = await axios.get(`https://marco-segura-8qpb.vercel.app/api/new-messages/${watermark.toISOString()}`);
        const fetchedMessages = response.data;
  
        // Suponiendo que los mensajes están ordenados por tiempo ascendente
        if (fetchedMessages.length) {
          // El nuevo tiempo de marca de agua será el tiempo del último mensaje recibido
          watermark = new Date(fetchedMessages[fetchedMessages.length - 1].timestamp);
        }
  
        setMessages((prevMessages) => {
          // Simplemente concatena los nuevos mensajes ya que se asume que no hay duplicados
          return [...prevMessages, ...fetchedMessages];
        });
  
        // No necesitamos actualizar el estado de lastPollTime aquí
        // ya que usamos una variable `watermark` local para la lógica.
      } catch (error) {
        console.error('Error fetching new messages:', error);
      }
    };
  
    const pollingInterval = setInterval(fetchNewMessages, 1000);
    return () => clearInterval(pollingInterval);
  }, [setMessages]); // 'lastPollTime' ya no es una dependencia.
  


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
            placeholder="Escribe un mensaje"
          />
          <button onClick={handleSendMessage} className="send-button">
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox; 

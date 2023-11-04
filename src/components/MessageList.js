import React, { useEffect, useRef } from 'react';
import './MessageList.css'; // Asume que tienes un archivo CSS para estilizar tu ChatBox
const MessageList = ({ messages }) => {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="message-list">
      {/* Asegúrate de que los mensajes se muestren en el orden correcto */}
      {messages.map((message, index) => (
  <div key={index} className="message">
    <div className="message-username">{message.username}</div>
    <span className="message-content">{message.content}</span>
  </div>
))}

      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default MessageList;

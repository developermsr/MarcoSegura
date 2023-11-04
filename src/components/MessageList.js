import React, { useEffect, useRef } from 'react';
import './MessageList.css';

const MessageList = ({ messages }) => {
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Suponiendo que cada mensaje tiene un id único
// ...

// Filtro por contenido y usuario de mensajes consecutivos
const uniqueMessages = messages.filter((msg, index, self) => {
  if (index === 0) return true; // Siempre mantén el primer mensaje
  const prevMsg = self[index - 1];
  return msg.username !== prevMsg.username || msg.content !== prevMsg.content;
});

// ...


  return (
    <div className="message-list">
      {uniqueMessages.map((message) => (
        <div key={message.id} className="message"> {/* Cambiado 'key' para usar 'message.id' */}
          <div className="message-username">{message.username}</div>
          <span className="message-content">{message.content}</span>
        </div>
      ))}
      <div ref={endOfMessagesRef} />
    </div>
  );
};

export default MessageList;

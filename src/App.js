// App.js
import React, { useState } from 'react';
import ChatBox from './components/ChatBox'; // Asegúrate de que la ruta al componente es correcta.
import './App.css'; // Asegúrate de que la ruta a tu archivo CSS es correcta.
import Cookies from 'js-cookie';
function generateUUID() {
  return 'xxxx-4xxx-yxxx-xxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
const App = () => {
  const [messages, setMessages] = useState([]);
  const getUsernameFromCookie = () => {
    let username = Cookies.get('username');
    if (!username) {
      username = 'Usuario-' + generateUUID();
      Cookies.set('username', username, { expires: 365 });
    }
    return username;
  };
  
  // Función para actualizar el estado de los mensajes con nuevos datos
  const updateMessages = (newMessages) => {
    setMessages(newMessages);
  };
  const sendMessageFunction = (newMessageContent) => {
    // Aquí va la lógica para enviar un mensaje
    // Por ejemplo, una petición POST a tu backend o API de mensajería
    const username = getUsernameFromCookie();
    const messageData = {
      username: username,
      content: newMessageContent,
    };
    const API_BASE_URL = 'https://marco-segura.vercel.app/api';

    fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(messageData), // Envía el mensaje y el nombre de usuario como parte del cuerpo de la solicitud
    })
    .then(response => response.json())
    .then(data => {
      setMessages(prevMessages => {
        const updatedMessages = [...prevMessages, data];
        console.log(updatedMessages); // Agregar esto para depuración
        return updatedMessages;
      });
    })// En el .then después de fetch
    .then(data => {
      console.log('Respuesta del servidor:', data);
      // resto del código para actualizar el estado
    })
    .catch(error => {
      console.error('Error sending message:', error);
    });
  };
  // Función para enviar un nuevo mensaje

  return (
    <div className="App">
      {/* Aquí podrías añadir más contenido si lo necesitaras */}
      <ChatBox
      messages={messages}
      setMessages={setMessages}
      sendMessage={sendMessageFunction}
    />
      {/* Y aquí más contenido si fuera necesario */}
    </div>
  );
};

export default App;

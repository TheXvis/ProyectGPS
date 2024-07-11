import io from 'socket.io-client';
import { useState, useEffect } from 'react';

const socket = io('/');

const ChatComponent = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newMessage = {
      body: message,
      from: 'TU',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Delivered' // Asumiendo que quieres mostrar el estado de entrega
    };
    setMessages([...messages, newMessage]);
    socket.emit('chat message', message);
  };

  useEffect(() => {
    socket.on('chat message', receiveMessage);
    return () => {
      socket.off('chat message', receiveMessage);
    };
  }, []);

  const receiveMessage = (msg) => setMessages((state) => [...state, msg]);

  return (
    <>
      <div>ChatComponent</div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          id="first_name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="mensaje"
          required
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" className="px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          <svg className="w-3 h-3 text-white me-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 16">
            <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
            <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
          </svg>
          enviar
        </button>
      </form>
      <ul>
        {messages.map((msg, index) => (
          <li key={index} className="flex items-start gap-2.5">
            <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-xl dark:bg-gray-700">
              <div className="flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{msg.from}</span>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{msg.timestamp}</span>
              </div>
              <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{msg.body}</p>
              <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{msg.status}</span>
            </div>
            {/* Aquí puedes agregar el botón y el menú desplegable si es necesario */}
          </li>
        ))}
      </ul>
    </>
  );
};

export default ChatComponent;
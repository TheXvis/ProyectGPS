import io from 'socket.io-client';
import { useState, useEffect, useCallback } from 'react';
import { useCarrierService } from '../../hooks/useCarrierService';
import { useUserService } from '../../hooks/useUserService';

const socket = io('/');

const ChatComponent = ({ partnerRut }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userName, setUserName] = useState('');

  const token = localStorage.getItem('token');
  const rawRut = localStorage.getItem('rut');
  const userRut = rawRut ? rawRut.replace(/\./g, '').replace('-', '') : '';
  const userRole = localStorage.getItem('role');

  const { getCarrierById } = useCarrierService();
  const { getUserById } = useUserService();

  useEffect(() => {
    const fetchUserName = async () => {
      let user;
      console.log('userRole:', userRole);
      if (userRole === 'carrier') {
        user = await getCarrierById(userRut);
        if (user) {
          setUserName(user.nombre);
        }
      } else {
        user = await getUserById(userRut);
        if (user) {
          setUserName(user.Nombre);
        }
      }
      if (!user) {
        console.error('User not found');
      }
    };

    fetchUserName();
  }, [userRut, userRole, getCarrierById, getUserById]);

  const receiveMessage = useCallback((msg) => {
    if (msg && msg.from && msg.to === userRut) {
      setMessages((state) => [...state, msg]);
    } else {
      console.error( msg);
    }
  }, [userRut]);

  useEffect(() => {
    socket.emit('join', { token, rut: userRut });

    socket.on('users', (users) => {
      setUsers(users);
      const differentUser = users.find(user => user !== userRut);
      if (differentUser && !selectedUser) {
        setSelectedUser(differentUser);
      }
    });

    socket.on('chat message', receiveMessage);

    return () => {
      socket.off('users');
      socket.off('chat message', receiveMessage);
    };
  }, [token, userRut, selectedUser, receiveMessage]);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('message:', message);
    console.log('userName:', userName);
    if (!message || !userName || !selectedUser) {
      console.error('Message, userName, or selectedUser is missing');
      return;
    }
    const newMessage = {
      body: message,
      from: userName,
      to: selectedUser,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'Delivered'
    };
    setMessages([...messages, newMessage]);
    socket.emit('chat message', { message, token, partnerRut: selectedUser, userRut });
    console.log(`Sent message: "${message}" from ${userName} (${userRole}) to ${selectedUser}`);
  };

  return (
    <>
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
      <div className="messages-container overflow-y-auto h-64">
        <ul>
          {messages.map((msg, index) => (
            <li key={index} className="flex items-start gap-2.5">
              <div className="flex flex-col w-full max-w-[320px] leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-xl dark:bg-gray-700">
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {msg.from.length > 5 ? `${msg.from.substring(0, 5)}...` : msg.from}
                  </span>
                  <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{msg.timestamp}</span>
                </div>
                <p className="text-sm font-normal py-2.5 text-gray-900 dark:text-white">{msg.body}</p>
                <span className="text-sm font-normal text-gray-500 dark:text-gray-400">{msg.status}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default ChatComponent;
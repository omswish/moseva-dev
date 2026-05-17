import { io } from 'socket.io-client';

let socket = null;

/**
 * Establish a persistent connection with the Socket.IO server
 * @param {string} token Access token
 */
export const connectSocket = (token) => {
  const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
  
  if (!socket) {
    socket = io(socketUrl, {
      auth: {
        token
      },
      autoConnect: false
    });
  } else {
    socket.auth.token = token;
  }

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

/**
 * Retrieve active socket instance
 */
export const getSocket = () => {
  return socket;
};

/**
 * Terminate active connection
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

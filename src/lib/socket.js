import io from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

let socket = null;

/**
 * Initialize and return the socket connection
 */
export const initializeSocket = () => {
  if (socket) return socket;

  socket = io(SOCKET_URL, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    transports: ["websocket", "polling"],
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  return socket;
};

/**
 * Get the existing socket instance or initialize if needed
 */
export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

/**
 * Join user to their personal notification room
 * @param {string} userId - The user ID
 */
export const joinNotificationRoom = (userId) => {
  if (!socket) {
    socket = initializeSocket();
  }
  if (socket && userId) {
    socket.emit("join_room", userId);
  }
};

/**
 * Listen for new notifications
 * @param {function} callback - Callback function to handle new notifications
 */
export const onNewNotification = (callback) => {
  const socketInstance = getSocket();
  socketInstance.on("new_notification", callback);
  
  // Return unsubscribe function
  return () => {
    socketInstance.off("new_notification", callback);
  };
};

/**
 * Disconnect the socket
 */
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

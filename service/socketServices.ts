let socket: WebSocket | null = null;

export const connectWebSocket = (
  onMessage: (data: string) => void
): void => {
  socket = new WebSocket('ws://192.168.8.115:8080/backend/ws/practical');

  socket.onopen = () => {
    console.log('WebSocket connection established');
  };

  socket.onmessage = (event) => {
    onMessage(String(event.data));
  };

  socket.onclose = () => {
    console.log('WebSocket connection closed');
  };

  socket.onerror = (error) => {
    console.error('WebSocket error', error);
  };
};

export const sendMessage = (message: string): void => {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(message);
  } else {
    console.warn('WebSocket is not connected');
  }
};

export const closeConnection = (): void => {
  socket?.close();
  socket = null;
};

import { Socket, io } from 'socket.io-client';

const SOCKET_SERVER_URL = 'http://localhost:3000'; // WebSocket server URL

export class WebSocketService {
  private socket: Socket;
  constructor() {
    this.socket = io(SOCKET_SERVER_URL);
  }

  connect() {
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('notification', (message) => {
      console.log('Received notification:', message);
      // Implement logic to display the notification in your application UI
    });
  }

  disconnect() {
    this.socket.disconnect();
    console.log('Disconnected from WebSocket server');
  }
}

export default WebSocketService;

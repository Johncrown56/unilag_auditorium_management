import { useEffect } from "react";
import WebSocketService from "../../services/WebSocketService";

const Notifications = () => {
  useEffect(() => {
    const webSocketService = new WebSocketService();
    webSocketService.connect();

    return () => {
      webSocketService.disconnect();
    };
  }, []);

  return <div>{/* messages here */}</div>;
};

export default Notifications;

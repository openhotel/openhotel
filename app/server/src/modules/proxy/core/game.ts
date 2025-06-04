import { ServerClient } from "@da/socket";

export const game = () => {
  const guest = async (
    clientId: string,
    state: string,
    connectionToken: string,
    ip: string,
  ) => {
    return true;
  };

  const connected = (client: ServerClient) => {
    try {
    } catch (e) {
      console.error("proxy-7");
      console.error(e);
    }
  };

  const disconnected = (client: ServerClient) => {
    try {
    } catch (e) {
      console.error("proxy-8");
      console.error(e);
    }
  };

  return {
    guest,
    connected,
    disconnected,
  };
};

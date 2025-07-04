import { ServerClient } from "@da/socket";

type UserRequestType = {
  accountId: string;
  gameId: string;
  token: string;
  ip: string;
};

export const game = () => {
  let userRequestMap: Record<string, UserRequestType> = {};
  let clientUserRequestMap: Record<string, UserRequestType> = {};

  let userMapClient: Record<string, ServerClient> = {};

  const guest = async (
    clientId: string,
    [gameId, accountId, token]: string[],
    ip: string,
  ) => {
    const accountToken = userRequestMap[accountId];
    if (!accountToken) return false;

    const valid =
      accountToken.gameId === gameId &&
      accountToken.token === token &&
      accountToken.ip === ip;

    if (!valid) return false;

    clientUserRequestMap[clientId] = userRequestMap[accountId];
    delete userRequestMap[accountId];

    return true;
  };

  const connected = (client: ServerClient) => {
    try {
      userMapClient[client.id] = client;
      console.log(clientUserRequestMap[client.id]);
    } catch (e) {
      console.error("proxy-game-1");
      console.error(e);
    }
  };

  const disconnected = (client: ServerClient) => {
    try {
      delete userMapClient[client.id];
      delete clientUserRequestMap[client.id];
    } catch (e) {
      console.error("proxy-game-2");
      console.error(e);
    }
  };

  const setUserRequest = (userRequest: UserRequestType) =>
    (userRequestMap[userRequest.accountId] = userRequest);

  return {
    guest,
    connected,
    disconnected,

    setUserRequest,
  };
};

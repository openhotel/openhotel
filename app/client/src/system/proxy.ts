import {
  getClientSocket,
  getConfig,
  getRandomString,
  getVersion,
  getWebSocketUrl,
} from "shared/utils";
import { Event } from "shared/enums";

export const proxy = () => {
  const config = getConfig();
  let $socket;

  const preConnect = async () =>
    new Promise(async (resolve) => {
      const response = await fetch(
        `${config.firewall.url}/request?version=${getVersion()}`,
      ).then((data) => data.json());

      $socket = getClientSocket({
        url: getWebSocketUrl(config.firewall.url),
        protocols: [response.token, response.session],
        reconnect: false,
        silent: true,
      });
      $socket.on("connected", () => {
        console.log("handhskae connected!");

        $socket.emit("session", { username: `player_${getRandomString(8)}` });
      });
      $socket.on("join", async (data) => {
        $socket.close();
        $socket = getClientSocket({
          url: getWebSocketUrl(config.proxy.url),
          protocols: [data.token, data.session],
          reconnect: false,
          silent: true,
        });
        resolve(1);
      });
      await $socket.connect();
    });

  const connect = async () => {
    return await new Promise(async (resolve) => {
      $socket.on("connected", () => {
        console.log("proxy connected!");
        resolve(1);
      });
      await $socket.connect();
    });
  };

  const emit = <Data>(event: Event, data: Data) => {
    $socket.emit("$$data", { event, message: data });
  };

  const on = <Data>(
    event: Event,
    callback: (data: Data) => void | Promise<void>,
  ) => $socket.on(event, callback);

  return {
    preConnect,
    connect,
    emit,
    on,
    // getSocket,
  };
};

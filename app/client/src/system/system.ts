import {
  getClientSocket,
  getConfig,
  getRandomString,
  getVersion,
  getWebSocketUrl,
} from "shared/utils";

export const System = (() => {
  const config = getConfig();

  let $socket;

  const connect = async () =>
    await new Promise(async (resolve) => {
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

        $socket.on("connected", () => {
          console.log("proxy connected!");
          resolve(1);

          $socket.emit("data", { event: "bonjour", message: {} });
        });

        await $socket.connect();
      });
      await $socket.connect();
    });

  const getSocket = () => $socket;

  return {
    connect,
    getSocket,
  };
})();

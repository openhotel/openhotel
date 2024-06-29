import { container, sprite } from "@tulib/tulip";
import { getClientSocket, getRandomString, getVersion } from "shared/utils";

export const mainComponent = async () => {
  const $container = await container();

  let port = 2002;
  try {
    const targetPort = parseInt(
      new URLSearchParams(location.search).get("port"),
    );

    if (!isNaN(targetPort)) port = targetPort;
  } catch (e) {}
  const { protocol, hostname } = location;
  const isSecure = hostname !== "localhost";

  const $logo = await sprite({
    texture: "logo_full.png",
  });
  await $logo.setPosition({ x: 8, y: 8 });
  $container.add($logo);

  {
    const response = await fetch(
      `${protocol}//${hostname}${port ? `:${port}` : ""}/request?version=${getVersion()}`,
    ).then((data) => data.json());

    let socket = getClientSocket({
      url: `${hostname}:${response.port}`,
      protocols: [response.token],
      reconnect: false,
    });
    socket.on("proxy", async ({ port, token }) => {
      socket = getClientSocket({
        url: `${hostname}:${port}`,
        protocols: [token],
        reconnect: false,
      });

      socket.on("connected", () => {
        console.log("proxy connected!");

        socket.emit("data", { event: "bonjour", message: {} });
      });

      await socket.connect(isSecure);
    });
    socket.on("connected", () => {
      console.log("handhskae connected!");

      socket.emit("session", { username: `player_${getRandomString(8)}` });
    });
    await socket.connect(isSecure);
  }

  return $container.getComponent(mainComponent);
};

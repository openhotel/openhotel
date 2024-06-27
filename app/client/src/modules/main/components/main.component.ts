import { container, sprite } from "@tulib/tulip";
import { getClientSocket, getRandomString } from "shared/utils";

export const mainComponent = async () => {
  const $container = await container();

  const $logo = await sprite({
    texture: "logo_full.png",
  });
  await $logo.setPosition({ x: 8, y: 8 });
  $container.add($logo);

  {
    const response = await fetch("http://localhost:2002/request").then((data) =>
      data.json(),
    );

    let socket = getClientSocket({
      url: `localhost:${response.port}`,
      protocols: [response.token],
      reconnect: false,
    });
    socket.on("proxy", async ({ port, token }) => {
      socket = getClientSocket({
        url: `localhost:${port}`,
        protocols: [token],
        reconnect: false,
      });

      socket.on("connected", () => {
        console.log("proxy connected!");

        socket.emit("data", { event: "bonjour", message: {} });
      });

      await socket.connect();
    });
    socket.on("connected", () => {
      console.log("handhskae connected!");

      socket.emit("session", { username: `player_${getRandomString(8)}` });
    });
    await socket.connect();
  }

  return $container.getComponent(mainComponent);
};

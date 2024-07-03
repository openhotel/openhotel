import { container, sprite } from "@tulib/tulip";
import { getClientSocket, getRandomString, getVersion } from "shared/utils";

export const mainComponent = async () => {
  const $container = await container();

  // const { protocol, hostname } = location;
  // const isSecure = !(
  //   hostname === "localhost" ||
  //   hostname.startsWith("192.") ||
  //   hostname.startsWith("172.")
  // );

  const $logo = await sprite({
    texture: "logo_full.png",
  });
  await $logo.setPosition({ x: 8, y: 8 });
  $container.add($logo);

  await new Promise(async (resolve) => {
    const response = await fetch(
      `http://localhost:2001/request?version=${getVersion()}`,
    ).then((data) => data.json());

    console.log(response);
    let socket = getClientSocket({
      url: `localhost:2001`,
      protocols: [response.token, response.session],
      reconnect: false,
    });
    socket.on("connected", () => {
      console.log("handhskae connected!");

      socket.emit("session", { username: `player_${getRandomString(8)}` });
    });
    socket.on("join", async (data) => {
      socket.close();
      socket = getClientSocket({
        url: `localhost:2005`,
        protocols: [data.token, data.session],
        reconnect: false,
      });

      socket.on("connected", () => {
        console.log("proxy connected!");
        resolve(1);

        socket.emit("data", { event: "bonjour", message: {} });
      });

      await socket.connect();
    });
    await socket.connect();
  });

  return $container.getComponent(mainComponent);
};

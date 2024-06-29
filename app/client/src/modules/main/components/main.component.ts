import { container, sprite } from "@tulib/tulip";
import { getClientSocket, getRandomString, getVersion } from "shared/utils";

export const mainComponent = async () => {
  const $container = await container();

  let url = new URL("http://localhost:2002");
  try {
    url = new URL(new URLSearchParams(location.search).get("server"));
  } catch (e) {}
  const { protocol, hostname, port } = url;

  const $logo = await sprite({
    texture: "logo_full.png",
  });
  await $logo.setPosition({ x: 8, y: 8 });
  $container.add($logo);

  {
    const response = await fetch(
      `${protocol}//${hostname}${port ? `:${port}` : ""}/request`,
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

      await socket.connect(true);
    });
    socket.on("connected", () => {
      console.log("handhskae connected!");

      socket.emit("session", { username: `player_${getRandomString(8)}` });
    });
    await socket.connect(true);
  }

  console.log(getVersion());

  return $container.getComponent(mainComponent);
};

import { ContainerComponent, container, text } from "@tulib/tulip";
import { System } from "system";

export const logComponent: ContainerComponent = async () => {
  const $container = await container();

  const renderText = async (message: string) => {
    const $text = await text({
      text: message,
      font: "Arial (sans-serif)",
      size: 12,
      color: 0xffffff,
      position: {
        x: 150,
        y: 0,
      },
    });
    $container.add($text);
  };

  const socket = System.getSocket();

  socket.on("logs", ({ logs }) => {
    if (!logs.length) return;
    renderText(logs.toReversed()[0]);
  });
  socket.on("log", ({ log }) => {
    $container.remove(...$container.getChildren());
    renderText(log);
  });

  return $container.getComponent(logComponent);
};
